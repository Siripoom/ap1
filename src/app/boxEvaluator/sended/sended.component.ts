// src/app/boxEvaluator/sended/sended.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import { HttpService } from '../../service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sended',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SideBarComponent],
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css'],
})
export class SendedComponent implements OnInit {
  papers: any[] = [];
  loading: boolean = true;
  user: any = null;
  statistics = {
    total: 0,
    pending: 0,
    completed: 0,
  };

  constructor(private api: HttpService) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.loadMyPapersToEvaluate();
  }

  loadMyPapersToEvaluate(): void {
    this.loading = true;

    const data = {
      header: 'getMyPapersToEvaluate',
      email: this.user.email,
    };

    this.api.POST('evaluator/individual-evaluation', data).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.papers = result.papers;
          this.statistics = {
            total: result.totalPapers,
            pending: result.pendingCount,
            completed: result.completedCount,
          };
        } else {
          console.error('Error loading papers:', result.error);
          Swal.fire(
            'ข้อผิดพลาด',
            result.error || 'ไม่สามารถโหลดข้อมูลได้',
            'error'
          );
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading papers:', error);
        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
        this.loading = false;
      },
    });
  }

  canEvaluate(paper: any): boolean {
    return paper.canEvaluate && paper.paperStatus !== 1;
  }

  getEvaluationStatusText(paper: any): string {
    if (paper.myEvaluationCount > 0) {
      return `ประเมินแล้ว (${paper.myEvaluationStatusText})`;
    }
    return 'รอการประเมิน';
  }

  getEvaluationStatusColor(paper: any): string {
    if (paper.myEvaluationCount > 0) {
      return 'text-green-600';
    }
    return 'text-orange-600';
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

  getStatusColorClass(status: number): string {
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

  viewPaper(paper: any): void {
    if (paper.file) {
      window.open(paper.file, '_blank');
    } else {
      Swal.fire('แจ้งเตือน', 'ไม่พบไฟล์บทความ', 'warning');
    }
  }

  evaluatePaper(paper: any): void {
    // ตรวจสอบสถานะการประเมินก่อนไปหน้าประเมิน
    const data = {
      header: 'checkIndividualEvaluationStatus',
      paperNo: paper.paperNo,
      email: this.user.email,
    };

    this.api.POST('evaluator/individual-evaluation', data).subscribe({
      next: (result: any) => {
        if (result.success) {
          if (result.canEvaluate) {
            // เก็บข้อมูลบทความใน sessionStorage
            sessionStorage.setItem('evaluationPaperNo', paper.paperNo);
            sessionStorage.setItem('evaluationPaperTitle', paper.titleNews);

            // นำทางไปหน้าประเมิน
            window.location.href = '/individual-evaluation';
          } else {
            Swal.fire({
              title: 'ไม่สามารถประเมินได้',
              text: result.message || 'คุณได้ประเมินบทความนี้แล้ว',
              icon: 'info',
            });
          }
        } else {
          Swal.fire('ข้อผิดพลาด', result.error, 'error');
        }
      },
      error: (error) => {
        console.error('Error checking evaluation status:', error);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถตรวจสอบสถานะการประเมินได้', 'error');
      },
    });
  }

  viewMyEvaluation(paper: any): void {
    const data = {
      header: 'getMyEvaluationDetails',
      paperNo: paper.paperNo,
      email: this.user.email,
    };

    this.api.POST('evaluator/individual-evaluation', data).subscribe({
      next: (result: any) => {
        if (result.success) {
          const evaluation = result.evaluation;

          Swal.fire({
            title: 'การประเมินของคุณ',
            html: `
              <div class="text-left space-y-2">
                <p><strong>วันที่ประเมิน:</strong> ${this.formatDate(
                  evaluation.evaluationDate
                )}</p>
                <p><strong>คะแนนรวม:</strong> ${evaluation.totalScore}/100</p>
                <p><strong>การตัดสินใจ:</strong> ${this.getStatusText(
                  evaluation.status
                )}</p>
                <p><strong>ความเห็น:</strong></p>
                <p class="text-sm bg-gray-100 p-2 rounded">${
                  evaluation.note
                }</p>
                ${
                  evaluation.file
                    ? `<p><strong>ไฟล์แนบ:</strong> <a href="${evaluation.file}" target="_blank" class="text-blue-600">ดูไฟล์</a></p>`
                    : ''
                }
              </div>
            `,
            icon: 'info',
            width: '600px',
          });
        } else {
          Swal.fire('ข้อผิดพลาด', result.error, 'error');
        }
      },
      error: (error) => {
        console.error('Error loading evaluation details:', error);
        Swal.fire(
          'ข้อผิดพลาด',
          'ไม่สามารถโหลดรายละเอียดการประเมินได้',
          'error'
        );
      },
    });
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

  refreshData(): void {
    this.loadMyPapersToEvaluate();
  }

  trackByPaper(index: number, paper: any): string {
    return paper.paperNo;
  }
}
