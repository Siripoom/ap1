import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScoreData {
  paperNo: string;
  evaluationCount: number;
  averageScore: number;
  percentage: number;
  maxScore: number;
  currentStatus: number;
  evaluationDetails: EvaluationDetail[];
  recommendation: Recommendation;
}

export interface EvaluationDetail {
  round: number;
  score: number;
  status: number;
}

export interface Recommendation {
  level: string;
  text: string;
  status: number;
}

export interface PaperSummary {
  no: string;
  titleNews: string;
  authorName: string;
  score: number;
  status: number;
  dateE: string;
  evaluation_count: number;
  recommendation?: Recommendation;
}

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private fetchURL = 'http://127.0.0.1:5000/';
  private php = 'dev/scoreManager';
  private ext = '.php';

  constructor(private http: HttpClient) {}

  /**
   * คำนวณคะแนนเฉลี่ย
   */
  calculateAverageScore(paperNo: string): Observable<ScoreData> {
    const data = {
      header: 'calculateAvgScore',
      paperNo: paperNo,
    };
    return this.http.post<ScoreData>(this.fetchURL + this.php + this.ext, data);
  }

  /**
   * อัปเดตสถานะอัตโนมัติ
   */
  updatePaperStatus(paperNo: string): Observable<any> {
    const data = {
      header: 'updatePaperStatus',
      paperNo: paperNo,
    };
    return this.http.post<any>(this.fetchURL + this.php + this.ext, data);
  }

  /**
   * ดึงสรุปการประเมิน
   */
  getEvaluationSummary(paperNo: string): Observable<any> {
    const data = {
      header: 'getEvaluationSummary',
      paperNo: paperNo,
    };
    return this.http.post<any>(this.fetchURL + this.php + this.ext, data);
  }

  /**
   * ดึงรายการบทความตามสถานะ
   */
  getPapersByStatus(status?: number): Observable<PaperSummary[]> {
    const data = {
      header: 'getPapersByStatus',
      status: status,
    };
    return this.http.post<PaperSummary[]>(
      this.fetchURL + this.php + this.ext,
      data
    );
  }

  /**
   * ประมวลผลคะแนนทั้งหมดอัตโนมัติ
   */
  processAllPendingScores(): Observable<any> {
    return this.http.post<any>(this.fetchURL + 'dev/batchScoreProcessor.php', {
      header: 'processAll',
    });
  }

  /**
   * แปลงสถานะเป็นข้อความ
   */
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'รอประเมิน';
      case 1:
        return 'ตอบรับแบบไม่แก้ไข';
      case 2:
        return 'ตอบรับแบบแก้ไขเล็กน้อย';
      case 3:
        return 'ตอบรับแบบแก้ไขมาก';
      case 4:
        return 'ไม่ตอบรับ';
      case 5:
        return 'ประเมินรอบ 2';
      default:
        return 'ไม่ทราบสถานะ';
    }
  }

  /**
   * แปลงระดับคะแนนเป็นสี
   */
  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  /**
   * แปลงสถานะเป็นสี
   */
  getStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'bg-gray-100 text-gray-800';
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 4:
        return 'bg-red-100 text-red-800';
      case 5:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
