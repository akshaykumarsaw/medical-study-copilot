import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import * as pdfParse from 'pdf-parse';
const pdf = pdfParse as unknown as (dataBuffer: Buffer) => Promise<any>;
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async uploadDocument(userId: string, file: Express.Multer.File, dto: UploadDocumentDto) {
    const client = this.supabaseService.getClient();
    const filePath = `${userId}/${Date.now()}-${file.originalname}`;

    // 1. Upload to Storage
    const { data: storageData, error: storageError } = await client.storage
      .from('documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (storageError) {
      this.logger.error(`Storage error: ${storageError.message}`);
      throw new Error(`Failed to upload to storage: ${storageError.message}`);
    }

    // 2. Insert into documents table
    const { data: docData, error: docError } = await client
      .from('documents')
      .insert({
        user_id: userId,
        title: dto.title,
        subject: dto.subject,
        type: dto.type,
        file_path: filePath,
        file_size_bytes: file.size,
        status: 'processing',
      })
      .select()
      .single();

    if (docError) {
      this.logger.error(`Database error: ${docError.message}`);
      throw new Error(`Failed to save document metadata: ${docError.message}`);
    }

    // 3. Trigger processing (async)
    this.processDocument(docData.id, file.buffer, userId);

    return docData;
  }

  async getUserDocuments(userId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async deleteDocument(userId: string, docId: string) {
    const client = this.supabaseService.getClient();
    
    // Get file path first
    const { data: doc } = await client
      .from('documents')
      .select('file_path')
      .eq('id', docId)
      .eq('user_id', userId)
      .single();

    if (!doc) throw new Error('Document not found');

    // Delete from storage
    await client.storage.from('documents').remove([doc.file_path]);

    // Delete from DB (cascades to chunks/embeddings)
    const { error } = await client.from('documents').delete().eq('id', docId);
    if (error) throw error;

    return { success: true };
  }

  private async processDocument(docId: string, buffer: Buffer, userId: string) {
    const client = this.supabaseService.getClient();
    try {
      this.logger.log(`Starting processing for document ${docId}`);
      
      // A. Extract Text
      const data = await pdf(buffer);
      const fullText = data.text;
      const pageCount = data.numpages;

      // Update page count
      await client
        .from('documents')
        .update({ page_count: pageCount })
        .eq('id', docId);

      // B. Chunk Text (Overlap Algorithm)
      const chunks = this.createChunks(fullText, 500, 50); // size 500 tokens-ish, overlap 50

      // C. Embed & Save
      for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i];
        
        // Save chunk
        const { data: chunkData, error: chunkError } = await client
          .from('chunks')
          .insert({
            document_id: docId,
            user_id: userId,
            subject: 'Unknown', // Ideally extract from doc metadata or pass down
            chunk_index: i,
            chunk_text: chunkText,
          })
          .select()
          .single();

        if (chunkError) continue;

        // Generate Embedding
        if (this.genAI) {
          const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
          const result = await model.embedContent(chunkText);
          const embedding = result.embedding.values;

          // Save embedding
          await client.from('chunk_embeddings').insert({
            chunk_id: chunkData.id,
            user_id: userId,
            document_id: docId,
            subject: 'Unknown',
            embedding: embedding,
          });
        }
      }

      // D. Final Status
      await client.from('documents').update({ status: 'ready' }).eq('id', docId);
      this.logger.log(`Finished processing document ${docId}`);

    } catch (error) {
      this.logger.error(`Processing failed for ${docId}: ${error.message}`);
      await client
        .from('documents')
        .update({ status: 'failed', error_message: error.message })
        .eq('id', docId);
    }
  }

  private createChunks(text: string, size: number, overlap: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += (size - overlap)) {
      const chunk = words.slice(i, i + size).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk);
      }
      if (i + size >= words.length) break;
    }
    
    return chunks;
  }
}
