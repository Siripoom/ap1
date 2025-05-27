import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import {
  ScoreService,
  PaperSummary,
  ScoreData,
} from '../../service/score.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-score-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SideBarComponent],
  template: `
    <header>
      <app-header></app-header>
    </header>
    <nav class="outLine">
      <aside>
        <app-side-bar></app-side-bar>
      </aside>
      <main class="p-6 bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              แดชบอร์ดจัดการคะแนน
            </h1>
            <p class="text-gray-600">
              ระบบคำนวณคะแนนเฉลี่ยและอัปเดตสถานะอัตโนมัติ
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              (click)="processAllScores()"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <i class="fas fa-calculator mr-2"></i>
              ประมวลผลทั้งหมด
            </button>
            <button
              (click)="refreshData()"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              รีเฟรชข้อมูล
            </button>
            <button
              (click)="exportReport()"
              class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <i class="fas fa-download mr-2"></i>
              ส่งออกรายงาน
            </button>
            <select
              [(ngModel)]="selectedStatus"
              (change)="filterByStatus()"
              class="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทุกสถานะ</option>
              <option value="0">รอประเมิน</option>
              <option value="1">ตอบรับ</option>
              <option value="2">แก้ไขเล็กน้อย</option>
              <option value="3">แก้ไขมาก</option>
              <option value="4">ไม่ตอบรับ</option>
            </select>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-file-alt text-gray-600"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">รวมทั้งหมด</p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ statistics.total }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-check text-green-600"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">ตอบรับ</p>
                  <p class="text-2xl font-semibold text-green-600">
                    {{ statistics.accepted }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-edit text-yellow-600"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">ต้องแก้ไข</p>
                  <p class="text-2xl font-semibold text-yellow-600">
                    {{ statistics.needRevision }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-times text-red-600"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">ไม่ตอบรับ</p>
                  <p class="text-2xl font-semibold text-red-600">
                    {{ statistics.rejected }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-clock text-blue-600"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">รอประเมิน</p>
                  <p class="text-2xl font-semibold text-blue-600">
                    {{ statistics.pending }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Papers List -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">รายการบทความ</h3>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      บทความ
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ผู้เขียน
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      คะแนนเฉลี่ย
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      จำนวนการประเมิน
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      สถานะ
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    *ngFor="
                      let paper of filteredPapers;
                      trackBy: trackByPaperNo
                    "
                  >
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ paper.titleNews }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">
                        {{ paper.authorName }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div
                        class="text-sm font-medium"
                        [ngClass]="getScoreColor(paper.score)"
                      >
                        {{ paper.score ? paper.score.toFixed(2) : 'N/A' }}
                        <span *ngIf="paper.score" class="text-xs text-gray-500">
                          ({{ ((paper.score / 100) * 100).toFixed(1) }}%)
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">
                        {{ paper.evaluation_count }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [ngClass]="getStatusColor(paper.status)"
                      >
                        {{ getStatusText(paper.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium">
                      <button
                        (click)="viewDetails(paper.no)"
                        class="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button
                        (click)="calculateScore(paper.no)"
                        class="text-green-600 hover:text-green-900 mr-3"
                      >
                        <i class="fas fa-calculator"></i>
                      </button>
                      <button
                        (click)="updateStatus(paper.no)"
                        class="text-purple-600 hover:text-purple-900"
                      >
                        <i class="fas fa-sync-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Detail Modal -->
        <div
          *ngIf="showDetailModal"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
          >
            <div class="mt-3">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  รายละเอียดการประเมิน
                </h3>
                <button
                  (click)="closeDetailModal()"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div *ngIf="selectedPaperDetail" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >ชื่อบทความ</label
                    >
                    <p class="mt-1 text-sm text-gray-900">
                      {{ selectedPaperDetail.titleNews }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >ผู้เขียน</label
                    >
                    <p class="mt-1 text-sm text-gray-900">
                      {{ selectedPaperDetail.authorName }}
                    </p>
                  </div>
                </div>

                <div
                  class="grid grid-cols-3 gap-4"
                  *ngIf="selectedPaperDetail.scoreAnalysis"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >คะแนนเฉลี่ย</label
                    >
                    <p
                      class="mt-1 text-2xl font-semibold"
                      [ngClass]="
                        getScoreColor(
                          selectedPaperDetail.scoreAnalysis.percentage
                        )
                      "
                    >
                      {{ selectedPaperDetail.scoreAnalysis.averageScore }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >เปอร์เซ็นต์</label
                    >
                    <p
                      class="mt-1 text-2xl font-semibold"
                      [ngClass]="
                        getScoreColor(
                          selectedPaperDetail.scoreAnalysis.percentage
                        )
                      "
                    >
                      {{ selectedPaperDetail.scoreAnalysis.percentage }}%
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >จำนวนการประเมิน</label
                    >
                    <p class="mt-1 text-2xl font-semibold text-gray-900">
                      {{ selectedPaperDetail.scoreAnalysis.evaluationCount }}
                    </p>
                  </div>
                </div>

                <div
                  class="bg-gray-50 p-4 rounded-lg"
                  *ngIf="selectedPaperDetail.scoreAnalysis?.recommendation"
                >
                  <h4 class="font-medium text-gray-900 mb-2">คำแนะนำ</h4>
                  <p class="text-sm text-gray-700">
                    {{ selectedPaperDetail.scoreAnalysis.recommendation.text }}
                  </p>
                </div>

                <div
                  *ngIf="
                    selectedPaperDetail.scoreAnalysis?.evaluationDetails
                      ?.length > 0
                  "
                >
                  <h4 class="font-medium text-gray-900 mb-2">
                    รายละเอียดการประเมิน
                  </h4>
                  <div class="space-y-2">
                    <div
                      *ngFor="
                        let detail of selectedPaperDetail.scoreAnalysis
                          .evaluationDetails
                      "
                      class="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span class="text-sm text-gray-600"
                        >รอบที่ {{ detail.round }}</span
                      >
                      <span class="text-sm font-medium"
                        >คะแนน: {{ detail.score }}</span
                      >
                      <span
                        class="text-xs px-2 py-1 rounded-full"
                        [ngClass]="getStatusColor(detail.status)"
                      >
                        {{ getStatusText(detail.status) }}
                      </span>
                    </div>
                  </div>
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
export class ScoreDashboardComponent implements OnInit {
  papers: PaperSummary[] = [];
  filteredPapers: PaperSummary[] = [];
  selectedStatus: string = '';
  showDetailModal: boolean = false;
  selectedPaperDetail: any = null;

  statistics = {
    total: 0,
    accepted: 0,
    needRevision: 0,
    rejected: 0,
    pending: 0,
  };

  constructor(private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.scoreService.getPapersByStatus().subscribe({
      next: (data) => {
        this.papers = data;
        this.filteredPapers = [...this.papers];
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error loading papers:', error);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', 'error');
      },
    });
  }

  calculateStatistics(): void {
    this.statistics = {
      total: this.papers.length,
      accepted: this.papers.filter((p) => p.status === 1).length,
      needRevision: this.papers.filter((p) => p.status === 2 || p.status === 3)
        .length,
      rejected: this.papers.filter((p) => p.status === 4).length,
      pending: this.papers.filter((p) => p.status === 0 || p.status === 5)
        .length,
    };
  }

  filterByStatus(): void {
    if (this.selectedStatus === '') {
      this.filteredPapers = [...this.papers];
    } else {
      this.filteredPapers = this.papers.filter(
        (p) => p.status.toString() === this.selectedStatus
      );
    }
  }

  processAllScores(): void {
    Swal.fire({
      title: 'ประมวลผลคะแนนทั้งหมด?',
      text: 'ระบบจะคำนวณคะแนนเฉลี่ยและอัปเดตสถานะของบทความทั้งหมด',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ดำเนินการ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.scoreService.processAllPendingScores().subscribe({
          next: (response) => {
            Swal.fire('สำเร็จ', 'ประมวลผลคะแนนเสร็จสิ้น', 'success');
            this.loadData();
          },
          error: (error) => {
            Swal.fire('ข้อผิดพลาด', 'ไม่สามารถประมวลผลได้', 'error');
          },
        });
      }
    });
  }

  refreshData(): void {
    this.loadData();
    Swal.fire('รีเฟรช', 'อัปเดตข้อมูลเรียบร้อย', 'success');
  }

  exportReport(): void {
    // Implementation for export functionality
    Swal.fire('ส่งออกรายงาน', 'ฟีเจอร์นี้จะพร้อมใช้งานเร็วๆ นี้', 'info');
  }

  viewDetails(paperNo: string): void {
    this.scoreService.getEvaluationSummary(paperNo).subscribe({
      next: (data) => {
        this.selectedPaperDetail = data;
        this.showDetailModal = true;
      },
      error: (error) => {
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดรายละเอียดได้', 'error');
      },
    });
  }

  calculateScore(paperNo: string): void {
    this.scoreService.calculateAverageScore(paperNo).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'ผลการคำนวณคะแนน',
          html: `
            <div class="text-left">
              <p><strong>คะแนนเฉลี่ย:</strong> ${data.averageScore}</p>
              <p><strong>เปอร์เซ็นต์:</strong> ${data.percentage}%</p>
              <p><strong>จำนวนการประเมิน:</strong> ${data.evaluationCount}</p>
              <p><strong>คำแนะนำ:</strong> ${data.recommendation.text}</p>
            </div>
          `,
          icon: 'info',
        });
      },
      error: (error) => {
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถคำนวณคะแนนได้', 'error');
      },
    });
  }

  updateStatus(paperNo: string): void {
    Swal.fire({
      title: 'อัปเดตสถานะ?',
      text: 'ระบบจะอัปเดตสถานะตามคะแนนเฉลี่ย',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'อัปเดต',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.scoreService.updatePaperStatus(paperNo).subscribe({
          next: (response) => {
            Swal.fire('สำเร็จ', 'อัปเดตสถานะเรียบร้อย', 'success');
            this.loadData();
          },
          error: (error) => {
            Swal.fire('ข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้', 'error');
          },
        });
      }
    });
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPaperDetail = null;
  }

  trackByPaperNo(index: number, paper: PaperSummary): string {
    return paper.no;
  }

  getStatusText(status: number): string {
    return this.scoreService.getStatusText(status);
  }

  getStatusColor(status: number): string {
    return this.scoreService.getStatusColor(status);
  }

  getScoreColor(score: number): string {
    const percentage = (score / 100) * 100;
    return this.scoreService.getScoreColor(percentage);
  }
}
