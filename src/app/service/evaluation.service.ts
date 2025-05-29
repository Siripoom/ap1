// src/app/service/evaluation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaperForEvaluation {
  no: string;
  titleNews: string;
  typesNews: string;
  name: string;
  email: string;
  file: string;
  date: string;
  noNews: string;
  authorTitle?: string;
  authorFname?: string;
  authorLname?: string;
}

export interface EvaluationQuestion {
  id: number;
  text: string;
}

export interface EvaluationSubmission {
  paperNo: string;
  email: string;
  evaluationRound: number;
  scores: number[];
  status: number;
  note: string;
  file?: string;
}

export interface EvaluationStatus {
  success: boolean;
  round1_completed: boolean;
  round2_completed: boolean;
  current_round: number | string;
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private fetchURL = 'http://127.0.0.1:5000/';
  private ext = '.php';

  constructor(private http: HttpClient) {}

  /**
   * ดึงข้อมูลบทความสำหรับการประเมิน
   */
  getPaperForEvaluation(paperNo: string): Observable<any> {
    const data = {
      header: 'getPaperForEvaluation',
      paperNo: paperNo,
    };
    return this.http.post<any>(
      this.fetchURL + 'evaluator/evaluation' + this.ext,
      data
    );
  }

  /**
   * ดึงคำถามสำหรับการประเมิน
   */
  getEvaluationQuestions(newsNo: string): Observable<any> {
    const data = {
      header: 'getEvaluationQuestions',
      newsNo: newsNo,
    };
    return this.http.post<any>(
      this.fetchURL + 'evaluator/evaluation' + this.ext,
      data
    );
  }

  /**
   * ส่งการประเมิน
   */
  submitEvaluation(evaluation: EvaluationSubmission): Observable<any> {
    const data = {
      header: 'submitEvaluation',
      ...evaluation,
    };
    return this.http.post<any>(
      this.fetchURL + 'evaluator/evaluation' + this.ext,
      data
    );
  }

  /**
   * ตรวจสอบสถานะการประเมิน
   */
  checkEvaluationStatus(
    paperNo: string,
    email: string
  ): Observable<EvaluationStatus> {
    const data = {
      header: 'checkEvaluationExists',
      paperNo: paperNo,
      email: email,
    };
    return this.http.post<EvaluationStatus>(
      this.fetchURL + 'evaluator/evaluation' + this.ext,
      data
    );
  }

  /**
   * ดึงรายการการประเมินของผู้ประเมิน
   */
  getMyEvaluations(email: string): Observable<any> {
    const data = {
      header: 'getMyEvaluations',
      email: email,
    };
    return this.http.post<any>(
      this.fetchURL + 'evaluator/evaluation' + this.ext,
      data
    );
  }

  /**
   * คำนวณคะแนนรวม
   */
  calculateTotalScore(scores: number[]): { total: number; percentage: number } {
    const sum = scores.reduce((total, score) => total + score, 0);
    const totalScore = sum * 2; // คูณ 2 ตามระบบ
    const maxScore = 100; // 10 คำถาม x 5 คะแนน x 2
    const percentage = (totalScore / maxScore) * 100;

    return {
      total: totalScore,
      percentage: percentage,
    };
  }

  /**
   * แนะนำสถานะตามคะแนน
   */
  suggestStatusByScore(percentage: number): number {
    if (percentage >= 80) return 1; // ตอบรับแบบไม่แก้ไข
    if (percentage >= 70) return 2; // แก้ไขเล็กน้อย
    if (percentage >= 60) return 3; // แก้ไขมาก
    return 4; // ไม่ตอบรับ
  }

  /**
   * แปลงสถานะเป็นข้อความ
   */
  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'ตอบรับแบบไม่แก้ไข';
      case 2:
        return 'ตอบรับแบบแก้ไขเล็กน้อย';
      case 3:
        return 'ตอบรับแบบแก้ไขมาก';
      case 4:
        return 'ไม่ตอบรับ';
      default:
        return 'ไม่ระบุสถานะ';
    }
  }

  /**
   * แปลงสถานะเป็นสี
   */
  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'text-green-600 bg-green-100';
      case 2:
        return 'text-blue-600 bg-blue-100';
      case 3:
        return 'text-yellow-600 bg-yellow-100';
      case 4:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * ตรวจสอบความครบถ้วนของคะแนน
   */
  isScoresComplete(scores: number[]): boolean {
    return (
      scores.every((score) => score >= 0 && score <= 5) &&
      scores.some((score) => score > 0)
    );
  }

  /**
   * ฟอร์แมตวันที่
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'ไม่ระบุ';

    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
