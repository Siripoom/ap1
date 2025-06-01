// src/app/boxDeveloper/evaluation-round-manager/evaluation-round-manager.component.ts
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
import { EvaluationRoundService } from '../../service/evaluation-round.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-round-manager',
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
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              จัดการรอบการประเมิน
            </h1>
            <p class="text-gray-600">
              เริ่มรอบการประเมินใหม่และจัดการผู้ประเมิน
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              (click)="openNewRoundModal()"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <i class="fas fa-plus mr-2"></i>
              เริ่มรอบใหม่
            </button>
            <button
              (click)="refreshData()"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              รีเฟรชข้อมูล
            </button>
            <select
              [(ngModel)]="selectedRound"
              (change)="filterByRound()"
              class="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทุกรอบ</option>
              <option value="1">รอบที่ 1</option>
              <option value="2">รอบที่ 2</option>
              <option value="3">รอบที่ 3</option>
              <option value="4">รอบที่ 4</option>
            </select>
            <button
              (click)="exportRoundReport()"
              class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <i class="fas fa-file-export mr-2"></i>
              ส่งออกรายงาน
            </button>
          </div>

          <!-- Papers by Round -->
          <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">
                รายการบทความตามรอบ
              </h3>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        (change)="toggleSelectAll($event)"
                        class="rounded border-gray-300"
                      />
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      บทความ
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      รอบปัจจุบัน
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ความคืบหน้า
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      คะแนนเฉลี่ย
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
                      <input
                        type="checkbox"
                        [(ngModel)]="paper.selected"
                        class="rounded border-gray-300"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ paper.titleNews }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ paper.authorName }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        รอบที่ {{ paper.evaluationRound }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="bg-blue-600 h-2 rounded-full"
                          [style.width.%]="paper.evaluationProgress"
                        ></div>
                      </div>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ paper.completedEvaluations }}/{{
                          paper.assignedEvaluators
                        }}
                        ประเมิน
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div
                        *ngIf="paper.averageScore"
                        class="text-sm font-medium text-gray-900"
                      >
                        {{ paper.averageScore }}
                      </div>
                      <div
                        *ngIf="!paper.averageScore"
                        class="text-sm text-gray-500"
                      >
                        รอประเมิน
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
                        (click)="viewPaperDetails(paper.no)"
                        class="text-blue-600 hover:text-blue-900 mr-3"
                        title="ดูรายละเอียด"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button
                        (click)="
                          manageEvaluators(paper.no, paper.evaluationRound)
                        "
                        class="text-green-600 hover:text-green-900 mr-3"
                        title="จัดการผู้ประเมิน"
                      >
                        <i class="fas fa-users-cog"></i>
                      </button>
                      <button
                        (click)="startNewRoundForPaper(paper.no)"
                        class="text-purple-600 hover:text-purple-900"
                        title="เริ่มรอบใหม่"
                      >
                        <i class="fas fa-redo"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div
            class="bg-white rounded-lg shadow p-6"
            *ngIf="getSelectedPapers().length > 0"
          >
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              การดำเนินการแบบเป็นกลุ่ม ({{ getSelectedPapers().length }} รายการ)
            </h3>
            <div class="flex space-x-4">
              <button
                (click)="bulkStartNewRound()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <i class="fas fa-play mr-2"></i>
                เริ่มรอบใหม่
              </button>
              <button
                (click)="bulkAssignEvaluators()"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <i class="fas fa-user-plus mr-2"></i>
                มอบหมายผู้ประเมิน
              </button>
            </div>
          </div>
        </div>

        <!-- New Round Modal -->
        <div
          *ngIf="showNewRoundModal"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white"
          >
            <form [formGroup]="newRoundForm" (ngSubmit)="submitNewRound()">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  เริ่มรอบการประเมินใหม่
                </h3>
                <button
                  type="button"
                  (click)="closeNewRoundModal()"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >รอบใหม่</label
                  >
                  <select
                    formControlName="newRound"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="2">รอบที่ 2</option>
                    <option value="3">รอบที่ 3</option>
                    <option value="4">รอบที่ 4</option>
                    <option value="5">รอบที่ 5</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >เหตุผล</label
                  >
                  <textarea
                    formControlName="reason"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="ระบุเหตุผลในการเริ่มรอบใหม่"
                  ></textarea>
                </div>
              </div>

              <div class="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  (click)="closeNewRoundModal()"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  [disabled]="!newRoundForm.valid"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  เริ่มรอบใหม่
                </button>
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
export class EvaluationRoundManagerComponent implements OnInit {
  papers: any[] = [];
  filteredPapers: any[] = [];
  selectedRound: string = '';
  showNewRoundModal: boolean = false;
  newRoundForm: FormGroup;
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private api: HttpService,
    private roundService: EvaluationRoundService
  ) {
    this.newRoundForm = this.fb.group({
      newRound: [2, Validators.required],
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.loadAllPapers();
  }

  loadAllPapers(): void {
    // โหลดบทความทั้งหมดจากทุกรอบ
    this.api
      .POST('dev/scoreManager', { header: 'getPapersByStatus' })
      .subscribe({
        next: (data: any) => {
          this.papers = Array.isArray(data)
            ? data.map((paper) => ({
                ...paper,
                selected: false,
                evaluationRound: paper.evaluationRound || 1,
                assignedEvaluators: paper.assignedEvaluators || 0,
                completedEvaluations: paper.completedEvaluations || 0,
                evaluationProgress: paper.evaluationProgress || 0,
              }))
            : [];
          this.filteredPapers = [...this.papers];
        },
        error: (error) => {
          console.error('Error loading papers:', error);
          Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', 'error');
        },
      });
  }

  filterByRound(): void {
    if (this.selectedRound === '') {
      this.filteredPapers = [...this.papers];
    } else {
      this.filteredPapers = this.papers.filter(
        (p) => p.evaluationRound.toString() === this.selectedRound
      );
    }
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.filteredPapers.forEach((paper) => (paper.selected = checked));
  }

  getSelectedPapers(): any[] {
    return this.filteredPapers.filter((paper) => paper.selected);
  }

  openNewRoundModal(): void {
    const selectedPapers = this.getSelectedPapers();
    if (selectedPapers.length === 0) {
      Swal.fire(
        'แจ้งเตือน',
        'กรุณาเลือกบทความที่ต้องการเริ่มรอบใหม่',
        'warning'
      );
      return;
    }
    this.showNewRoundModal = true;
  }

  closeNewRoundModal(): void {
    this.showNewRoundModal = false;
    this.newRoundForm.reset({
      newRound: 2,
      reason: '',
    });
  }

  submitNewRound(): void {
    if (!this.newRoundForm.valid) {
      return;
    }

    const selectedPapers = this.getSelectedPapers();
    const formData = this.newRoundForm.value;

    const data = {
      header: 'startNewEvaluationRound',
      paperNos: selectedPapers.map((p) => p.no),
      newRound: parseInt(formData.newRound),
      reason: formData.reason,
      adminEmail: this.user.email,
    };

    this.api.POST('user/evaluationRoundManager', data).subscribe({
      next: (result: any) => {
        if (result.success) {
          Swal.fire({
            title: 'สำเร็จ',
            html: `
              <div class="text-left">
                <p>เริ่มรอบการประเมินใหม่เรียบร้อยแล้ว</p>
                <p><strong>จำนวนบทความ:</strong> ${result.processedPapers}</p>
                <p><strong>รอบใหม่:</strong> ${result.newRound}</p>
              </div>
            `,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
          });
          this.closeNewRoundModal();
          this.loadAllPapers();
        } else {
          Swal.fire('ข้อผิดพลาด', result.error, 'error');
        }
      },
      error: (error) => {
        console.error('Error starting new round:', error);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเริ่มรอบใหม่ได้', 'error');
      },
    });
  }

  bulkStartNewRound(): void {
    this.openNewRoundModal();
  }

  bulkAssignEvaluators(): void {
    Swal.fire(
      'ฟีเจอร์ในอนาคต',
      'การมอบหมายผู้ประเมินแบบกลุ่มจะพร้อมใช้งานเร็วๆ นี้',
      'info'
    );
  }

  startNewRoundForPaper(paperNo: string): void {
    // เลือกเฉพาะบทความนี้
    this.papers.forEach((p) => (p.selected = p.no === paperNo));
    this.filterByRound(); // รีเฟรชการแสดงผล
    this.openNewRoundModal();
  }

  viewPaperDetails(paperNo: string): void {
    this.roundService.getEvaluationRoundStatus(paperNo).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'รายละเอียดรอบการประเมิน',
          html: `
            <div class="text-left space-y-2">
              <p><strong>รอบปัจจุบัน:</strong> ${data.currentRound}</p>
              <p><strong>สถานะ:</strong> ${this.getStatusText(data.status)}</p>
              <p><strong>ผู้ประเมินที่มอบหมาย:</strong> ${
                data.assignedEvaluators
              }</p>
              <p><strong>ประเมินเสร็จแล้ว:</strong> ${
                data.completedEvaluations
              }</p>
              <p><strong>ความคืบหน้า:</strong> ${data.evaluationProgress}%</p>
              ${
                data.lastChangeReason
                  ? `<p><strong>เหตุผลการเปลี่ยนรอบ:</strong> ${data.lastChangeReason}</p>`
                  : ''
              }
              ${
                data.lastChangeDate
                  ? `<p><strong>วันที่เปลี่ยนรอบ:</strong> ${this.formatDate(
                      data.lastChangeDate
                    )}</p>`
                  : ''
              }
            </div>
          `,
          icon: 'info',
          width: '500px',
        });
      },
      error: (error) => {
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดรายละเอียดได้', 'error');
      },
    });
  }

  manageEvaluators(paperNo: string, round: number): void {
    // ไปยังหน้าจัดการผู้ประเมิน
    sessionStorage.setItem('managePaperNo', paperNo);
    sessionStorage.setItem('manageRound', round.toString());
    window.location.href = '/setEvaluator';
  }

  refreshData(): void {
    this.loadAllPapers();
    Swal.fire('รีเฟรช', 'อัปเดตข้อมูลเรียบร้อย', 'success');
  }

  exportRoundReport(): void {
    // ฟีเจอร์ส่งออกรายงาน
    Swal.fire('ส่งออกรายงาน', 'ฟีเจอร์นี้จะพร้อมใช้งานเร็วๆ นี้', 'info');
  }

  trackByPaperNo(index: number, paper: any): string {
    return paper.no;
  }

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
        return 'กำลังประเมิน';
      default:
        return 'ไม่ทราบสถานะ';
    }
  }

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
