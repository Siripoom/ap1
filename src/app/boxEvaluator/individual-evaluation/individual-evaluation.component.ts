// src/app/boxEvaluator/individual-evaluation/individual-evaluation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import { HttpService } from '../../service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-individual-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SideBarComponent,
  ],
  template: `
    <header>
      <app-header></app-header>
    </header>
    <nav class="outLine">
      <aside>
        <app-side-bar></app-side-bar>
      </aside>
      <main class="p-6 bg-gray-50 min-h-screen">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">ประเมินบทความ</h1>
            <p class="text-gray-600">กรุณาประเมินบทความตามเกณฑ์ที่กำหนด</p>
            <div class="mt-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <i class="fas fa-info-circle mr-2"></i>
              การประเมินของคุณจะเป็นอิสระ ไม่ขึ้นอยู่กับผู้ประเมินคนอื่น
            </div>
          </div>

          <!-- Paper Information -->
          <div class="bg-white rounded-lg shadow mb-6 p-6" *ngIf="paperData">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              ข้อมูลบทความ
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ชื่อบทความ</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ paperData.titleNews }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ผู้เขียน</label
                >
                <p class="mt-1 text-sm text-gray-900">{{ paperData.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ประเภท</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ paperData.typesNews }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >วันที่ส่ง</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDate(paperData.date) }}
                </p>
              </div>
            </div>

            <!-- Paper File -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >ไฟล์บทความ</label
              >
              <button
                (click)="openPaperFile()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <i class="fas fa-file-pdf mr-2"></i>
                เปิดไฟล์บทความ
              </button>
            </div>
          </div>

          <!-- Evaluation Form -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">แบบประเมิน</h2>

            <form [formGroup]="evaluationForm" (ngSubmit)="submitEvaluation()">
              <!-- Evaluation Questions -->
              <div class="space-y-6 mb-6">
                <div
                  *ngFor="let question of questions; let i = index"
                  class="border-b border-gray-200 pb-4"
                >
                  <h3 class="text-sm font-medium text-gray-900 mb-3">
                    {{ i + 1 }}. {{ question.text }}
                  </h3>

                  <!-- Score Options -->
                  <div class="flex flex-wrap gap-4">
                    <div
                      *ngFor="let score of scoreOptions"
                      class="flex items-center"
                    >
                      <input
                        type="radio"
                        [id]="'q' + i + '_s' + score"
                        [name]="'question_' + i"
                        [value]="score"
                        (change)="updateScore(i, score)"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        [for]="'q' + i + '_s' + score"
                        class="ml-2 text-sm text-gray-700 cursor-pointer"
                      >
                        {{ score }}
                      </label>
                    </div>
                  </div>

                  <!-- Score Description -->
                  <div class="mt-2 text-xs text-gray-500">
                    คะแนน: 0 = ไม่มีเลย, 1 = น้อยมาก, 2 = น้อย, 3 = ปานกลาง, 4 =
                    มาก, 5 = มากที่สุด
                  </div>
                </div>
              </div>

              <!-- Total Score Display -->
              <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700"
                    >คะแนนรวม:</span
                  >
                  <span class="text-lg font-bold text-blue-600"
                    >{{ totalScore }}/{{ maxScore }}</span
                  >
                </div>
                <div class="flex justify-between items-center mt-1">
                  <span class="text-sm text-gray-500">เปอร์เซ็นต์:</span>
                  <span
                    class="text-sm font-medium"
                    [ngClass]="getScoreColorClass(percentage)"
                  >
                    {{ percentage.toFixed(1) }}%
                  </span>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                  <i class="fas fa-lightbulb mr-1"></i>
                  แนะนำ: {{ getRecommendationText(percentage) }}
                </div>
              </div>

              <!-- Evaluation Decision -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3"
                  >การตัดสินใจ <span class="text-red-500">*</span></label
                >
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="status_1"
                      name="evaluation_status"
                      value="1"
                      formControlName="status"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label
                      for="status_1"
                      class="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      ตอบรับแบบไม่แก้ไข
                      <span class="text-xs text-gray-500 ml-2"
                        >(80% ขึ้นไป)</span
                      >
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="status_2"
                      name="evaluation_status"
                      value="2"
                      formControlName="status"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      for="status_2"
                      class="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      ตอบรับแบบแก้ไขเล็กน้อย
                      <span class="text-xs text-gray-500 ml-2">(70-79%)</span>
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="status_3"
                      name="evaluation_status"
                      value="3"
                      formControlName="status"
                      class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <label
                      for="status_3"
                      class="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      ตอบรับแบบแก้ไขมาก
                      <span class="text-xs text-gray-500 ml-2">(60-69%)</span>
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="status_4"
                      name="evaluation_status"
                      value="4"
                      formControlName="status"
                      class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <label
                      for="status_4"
                      class="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      ไม่ตอบรับ
                      <span class="text-xs text-gray-500 ml-2"
                        >(ต่ำกว่า 60%)</span
                      >
                    </label>
                  </div>
                </div>
              </div>

              <!-- Comments -->
              <div class="mb-6">
                <label
                  for="note"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  ความเห็นและข้อเสนอแนะ <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="note"
                  formControlName="note"
                  rows="5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="กรุณาให้ความเห็นและข้อเสนอแนะสำหรับบทความนี้ รวมถึงจุดแข็ง จุดอ่อน และข้อควรปรับปรุง"
                ></textarea>
                <div class="mt-1 text-xs text-gray-500">
                  ความเห็นของคุณจะช่วยให้ผู้เขียนสามารถปรับปรุงบทความได้ดีขึ้น
                </div>
              </div>

              <!-- Evaluation File Upload -->
              <div class="mb-6">
                <label
                  for="file"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  ไฟล์ความเห็นเพิ่มเติม (URL) - ไม่บังคับ
                </label>
                <input
                  type="url"
                  id="file"
                  formControlName="file"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/evaluation-file.pdf"
                />
                <div class="mt-1 text-xs text-gray-500">
                  หากต้องการแนบไฟล์ความเห็นรายละเอียด
                  กรุณาอัปโหลดไฟล์และใส่ลิงก์ที่นี่
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  (click)="goBack()"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  [disabled]="!evaluationForm.valid || !isScoresComplete()"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
                >
                  <i class="fas fa-save mr-2"></i>
                  บันทึกการประเมิน
                </button>
              </div>

              <!-- Form Validation Messages -->
              <div
                *ngIf="!isScoresComplete() || !evaluationForm.valid"
                class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div class="text-sm text-yellow-800">
                  <div
                    *ngIf="!isScoresComplete()"
                    class="flex items-center mb-1"
                  >
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    กรุณาให้คะแนนทุกข้อ
                  </div>
                  <div
                    *ngIf="evaluationForm.get('status')?.invalid"
                    class="flex items-center mb-1"
                  >
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    กรุณาเลือกการตัดสินใจ
                  </div>
                  <div
                    *ngIf="evaluationForm.get('note')?.invalid"
                    class="flex items-center"
                  >
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    กรุณาให้ความเห็นและข้อเสนอแนะ
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </nav>
  `,
  styles: [
    `
      .outLine {
        background: whitesmoke;
        display: grid;
        grid-template-columns: max-content auto;
      }
    `,
  ],
})
export class IndividualEvaluationComponent implements OnInit {
  paperData: any = null;
  questions: any[] = [];
  evaluationForm: FormGroup;
  scores: number[] = Array(10).fill(0);
  scoreOptions: number[] = [0, 1, 2, 3, 4, 5];
  totalScore: number = 0;
  maxScore: number = 100; // 10 คำถาม x 5 คะแนน x 2
  percentage: number = 0;
  paperNo: string = '';
  user: any = null;

  constructor(private fb: FormBuilder, private api: HttpService) {
    this.evaluationForm = this.fb.group({
      status: ['', Validators.required],
      note: ['', Validators.required],
      file: [''],
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.paperNo = sessionStorage.getItem('evaluationPaperNo') || '';

    if (!this.paperNo) {
      Swal.fire('ข้อผิดพลาด', 'ไม่พบข้อมูลบทความ', 'error').then(() => {
        this.goBack();
      });
      return;
    }

    this.loadPaperData();
    this.loadEvaluationQuestions();
  }

  loadPaperData(): void {
    const data = {
      header: 'getPaperForEvaluation',
      paperNo: this.paperNo,
    };

    this.api.POST('evaluator/evaluation', data).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.paperData = result.paper;
        } else {
          Swal.fire(
            'ข้อผิดพลาด',
            result.error || 'ไม่สามารถโหลดข้อมูลบทความได้',
            'error'
          );
        }
      },
      error: (error) => {
        console.error('Error loading paper:', error);
        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
      },
    });
  }

  loadEvaluationQuestions(): void {
    const data = {
      header: 'getEvaluationQuestions',
      newsNo: this.paperData?.noNews || '',
    };

    this.api.POST('evaluator/evaluation', data).subscribe({
      next: (result: any) => {
        if (result.success) {
          const questionsData = result.questions;
          this.questions = [];

          // แปลงข้อมูลคำถามเป็น array
          for (let i = 1; i <= 10; i++) {
            const questionKey = `question${i.toString().padStart(2, '0')}`;
            if (questionsData[questionKey]) {
              this.questions.push({
                id: i,
                text: questionsData[questionKey],
              });
            }
          }

          // หากไม่มีคำถาม ใช้คำถามเริ่มต้น
          if (this.questions.length === 0) {
            this.loadDefaultQuestions();
          }
        } else {
          this.loadDefaultQuestions();
        }
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.loadDefaultQuestions();
      },
    });
  }

  loadDefaultQuestions(): void {
    this.questions = [
      {
        id: 1,
        text: 'เป็นผลงานที่มีการกำหนดประเด็นที่ต้องการอธิบายหรือวิเคราะห์อย่างชัดเจน',
      },
      {
        id: 2,
        text: 'เป็นผลงานที่มีเนื้อหาสาระถูกต้องสมบูรณ์ มีแนวคิดและการนำเสนอที่ชัดเจน',
      },
      {
        id: 3,
        text: 'เป็นผลงานที่มีแหล่งอ้างอิงที่ถูกต้อง การใช้ภาษาที่ชัดเจน เหมาะสม',
      },
      {
        id: 4,
        text: 'เป็นผลงานที่มีการนำเสนอที่ชัดเจน มีเอกภาพ ไม่สับสน',
      },
      {
        id: 5,
        text: 'เป็นผลงานที่มีการวิเคราะห์และเสนอความรู้หรือวิธีการที่ทันสมัย',
      },
      {
        id: 6,
        text: 'เป็นผลงานที่มีเนื้อหาสาระทางวิชาการที่ทันสมัย',
      },
      {
        id: 7,
        text: 'เป็นผลงานที่สามารถนำไปใช้เป็นแหล่งอ้างอิงหรือนำไปปฏิบัติได้',
      },
      {
        id: 8,
        text: 'เป็นผลงานที่มีลักษณะเป็นงานบุกเบิกความรู้ใหม่ในเรื่องใดเรื่องหนึ่ง',
      },
      {
        id: 9,
        text: 'เป็นผลงานที่มีการกระตุ้นให้เกิดความคิดและค้นคว้าอย่างต่อเนื่อง',
      },
      {
        id: 10,
        text: 'เป็นผลงานที่มีการวิเคราะห์อย่างเป็นระบบ และสรุปประเด็นการวิเคราะห์',
      },
    ];
  }

  updateScore(questionIndex: number, score: number): void {
    this.scores[questionIndex] = score;
    this.calculateTotalScore();
  }

  calculateTotalScore(): void {
    const sum = this.scores.reduce((total, score) => total + score, 0);
    this.totalScore = sum * 2; // คูณ 2 ตามระบบ
    this.percentage = (this.totalScore / this.maxScore) * 100;

    // แนะนำสถานะตามคะแนน
    this.suggestStatus();
  }

  suggestStatus(): void {
    let suggestedStatus = '';

    if (this.percentage >= 80) {
      suggestedStatus = '1'; // ตอบรับแบบไม่แก้ไข
    } else if (this.percentage >= 70) {
      suggestedStatus = '2'; // แก้ไขเล็กน้อย
    } else if (this.percentage >= 60) {
      suggestedStatus = '3'; // แก้ไขมาก
    } else {
      suggestedStatus = '4'; // ไม่ตอบรับ
    }

    this.evaluationForm.patchValue({ status: suggestedStatus });
  }

  isScoresComplete(): boolean {
    return (
      this.scores.every((score) => score >= 0) &&
      this.scores.some((score) => score > 0)
    );
  }

  getScoreColorClass(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getRecommendationText(percentage: number): string {
    if (percentage >= 80) return 'ตอบรับแบบไม่แก้ไข';
    if (percentage >= 70) return 'ตอบรับแบบแก้ไขเล็กน้อย';
    if (percentage >= 60) return 'ตอบรับแบบแก้ไขมาก';
    return 'ไม่ตอบรับ';
  }

  submitEvaluation(): void {
    if (!this.evaluationForm.valid || !this.isScoresComplete()) {
      Swal.fire('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
      return;
    }

    const formData = this.evaluationForm.value;

    const confirmMessage = `
      <div class="text-left">
        <p><strong>คะแนนรวม:</strong> ${this.totalScore}/${
      this.maxScore
    } (${this.percentage.toFixed(1)}%)</p>
        <p><strong>การตัดสินใจ:</strong> ${this.getStatusText(
          parseInt(formData.status)
        )}</p>
        <p><strong>ความเห็น:</strong></p>
        <div class="bg-gray-100 p-2 rounded text-sm mt-1">${formData.note}</div>
      </div>
    `;

    Swal.fire({
      title: 'ยืนยันการประเมิน',
      html: confirmMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'บันทึกการประเมิน',
      cancelButtonText: 'ยกเลิก',
      width: '500px',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveEvaluation();
      }
    });
  }

  private saveEvaluation(): void {
    const formData = this.evaluationForm.value;

    const data = {
      header: 'submitIndividualEvaluation',
      paperNo: this.paperNo,
      evaluatorEmail: this.user.email,
      scores: this.scores,
      status: parseInt(formData.status),
      note: formData.note,
      file: formData.file || '',
    };

    this.api.POST('evaluator/individual-evaluation', data).subscribe({
      next: (result: any) => {
        if (result.success) {
          Swal.fire({
            title: 'บันทึกสำเร็จ',
            html: `
              <div class="text-left">
                <p>การประเมินได้รับการบันทึกเรียบร้อยแล้ว</p>
                <p><strong>คะแนนรวม:</strong> ${result.totalScore}/100</p>
                <p class="text-sm text-gray-600 mt-2">ขอบคุณสำหรับการประเมิน</p>
              </div>
            `,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            // ลบข้อมูลจาก sessionStorage
            sessionStorage.removeItem('evaluationPaperNo');
            sessionStorage.removeItem('evaluationPaperTitle');
            this.goBack();
          });
        } else {
          Swal.fire(
            'ข้อผิดพลาด',
            result.error || 'ไม่สามารถบันทึกการประเมินได้',
            'error'
          );
        }
      },
      error: (error) => {
        console.error('Error submitting evaluation:', error);
        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
      },
    });
  }

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
        return 'ไม่ระบุ';
    }
  }

  openPaperFile(): void {
    if (this.paperData && this.paperData.file) {
      window.open(this.paperData.file, '_blank');
    } else {
      Swal.fire('แจ้งเตือน', 'ไม่พบไฟล์บทความ', 'warning');
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'ไม่ระบุ';

    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  goBack(): void {
    window.location.href = '/sended';
  }
}
