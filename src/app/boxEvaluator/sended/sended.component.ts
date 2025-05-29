import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import { HttpService } from '../../service/http.service';
import { EvaluationService } from '../../service/evaluation.service';

@Component({
  selector: 'app-sended',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SideBarComponent],
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
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              บทความที่ต้องประเมิน
            </h1>
            <p class="text-gray-600">รายการบทความที่ได้รับมอบหมายให้ประเมิน</p>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-8">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
            <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>

          <!-- No Data -->
          <div *ngIf="!loading && papers.length === 0" class="text-center py-8">
            <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
              <i class="fas fa-file-alt text-4xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              ไม่มีบทความที่ต้องประเมิน
            </h3>
            <p class="text-gray-500">
              ในขณะนี้ยังไม่มีบทความที่ได้รับมอบหมายให้คุณประเมิน
            </p>
          </div>

          <!-- Papers List -->
          <div *ngIf="!loading && papers.length > 0" class="space-y-4">
            <div
              *ngFor="let paper of papers; trackBy: trackByPaper"
              class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                      {{ paper.titleNews }}
                    </h3>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p>
                        <span class="font-medium">ผู้เขียน:</span>
                        {{ paper.authorName }}
                      </p>
                      <p>
                        <span class="font-medium">ประเภท:</span>
                        {{ paper.typesNews }}
                      </p>
                      <p>
                        <span class="font-medium">วันที่ส่ง:</span>
                        {{ formatDate(paper.date) }}
                      </p>
                    </div>
                  </div>

                  <!-- Status Badge -->
                  <div class="ml-4">
                    <span
                      class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                      [ngClass]="getStatusColorClass(paper.status)"
                    >
                      {{ getStatusText(paper.status) }}
                    </span>
                  </div>
                </div>

                <!-- Evaluation Status -->
                <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="text-sm">
                      <span class="font-medium text-gray-700"
                        >สถานะการประเมิน:</span
                      >
                      <span
                        class="ml-2"
                        [ngClass]="
                          getEvaluationStatusColor(paper.evaluationStatus)
                        "
                      >
                        {{ getEvaluationStatusText(paper.evaluationStatus) }}
                      </span>
                    </div>
                    <div *ngIf="paper.score > 0" class="text-sm">
                      <span class="font-medium text-gray-700">คะแนน:</span>
                      <span
                        class="ml-2 font-bold"
                        [ngClass]="getScoreColorClass(paper.score)"
                      >
                        {{ paper.score }}/100
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-3">
                  <button
                    (click)="viewPaper(paper)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <i class="fas fa-eye mr-2"></i>
                    ดูบทความ
                  </button>

                  <button
                    *ngIf="canEvaluate(paper)"
                    (click)="evaluatePaper(paper)"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    <i class="fas fa-clipboard-check mr-2"></i>
                    {{ getEvaluateButtonText(paper.evaluationStatus) }}
                  </button>

                  <button
                    *ngIf="paper.evaluationStatus !== 'none'"
                    (click)="viewEvaluationHistory(paper)"
                    class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    <i class="fas fa-history mr-2"></i>
                    ดูประวัติการประเมิน
                  </button>
                </div>
              </div>
            </div>
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
export class SendedComponent implements OnInit {
  papers: any[] = [];
  loading: boolean = true;
  user: any = null;

  constructor(
    private api: HttpService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.loadMyEvaluations();
  }

  loadMyEvaluations(): void {
    this.loading = true;

    this.evaluationService.getMyEvaluations(this.user.email).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.papers = result.evaluations;
          // เพิ่มสถานะการประเมินให้แต่ละบทความ
          this.papers.forEach((paper) => {
            paper.evaluationStatus = this.determineEvaluationStatus(paper);
          });
        } else {
          console.error('Error loading evaluations:', result.error);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading evaluations:', error);
        this.loading = false;
      },
    });
  }

  determineEvaluationStatus(paper: any): string {
    if (paper.evaluated1 && paper.evaluated2) {
      return 'completed'; // ประเมินครบแล้ว
    } else if (paper.evaluated1) {
      return 'round1'; // ประเมินรอบ 1 แล้ว
    } else {
      return 'none'; // ยังไม่ได้ประเมิน
    }
  }

  canEvaluate(paper: any): boolean {
    return paper.evaluationStatus !== 'completed' && paper.status !== 1;
  }

  getEvaluateButtonText(status: string): string {
    switch (status) {
      case 'none':
        return 'ประเมิน (รอบที่ 1)';
      case 'round1':
        return 'ประเมิน (รอบที่ 2)';
      default:
        return 'ประเมิน';
    }
  }

  getEvaluationStatusText(status: string): string {
    switch (status) {
      case 'none':
        return 'รอการประเมิน';
      case 'round1':
        return 'ประเมินรอบ 1 แล้ว';
      case 'completed':
        return 'ประเมินครบแล้ว';
      default:
        return 'ไม่ทราบสถานะ';
    }
  }

  getEvaluationStatusColor(status: string): string {
    switch (status) {
      case 'none':
        return 'text-gray-600';
      case 'round1':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  }

  getStatusText(status: number): string {
    return this.evaluationService.getStatusText(status);
  }

  getStatusColorClass(status: number): string {
    return this.evaluationService.getStatusColor(status);
  }

  getScoreColorClass(score: number): string {
    const percentage = score;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  viewPaper(paper: any): void {
    if (paper.file) {
      window.open(paper.file, '_blank');
    } else {
      alert('ไม่พบไฟล์บทความ');
    }
  }

  evaluatePaper(paper: any): void {
    // เก็บข้อมูลบทความใน sessionStorage
    sessionStorage.setItem('no', paper.noPaper);
    sessionStorage.setItem('title', paper.titleNews);

    // นำทางไปหน้าประเมิน
    window.location.href = '/evaluation';
  }

  viewEvaluationHistory(paper: any): void {
    // TODO: สร้างหน้าดูประวัติการประเมิน
    alert('ฟีเจอร์นี้จะพร้อมใช้งานเร็วๆ นี้');
  }

  formatDate(dateString: string): string {
    return this.evaluationService.formatDate(dateString);
  }

  trackByPaper(index: number, paper: any): string {
    return paper.noPaper;
  }
}
