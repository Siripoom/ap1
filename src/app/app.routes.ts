import { registerGuard } from './guard/register.guard';
import { developerGuard } from './guard/developer.guard';
import { GradeComponent } from './boxEvaluator/grade/grade.component';
import { CallForPaperComponent } from './boxVisitor/call-for-paper/call-for-paper.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './boxUser/home/home.component';
import { SigninComponent } from './boxVisitor/signin/signin.component';
import { SignupComponent } from './boxVisitor/signup/signup.component';
import { HomeVisitorComponent } from './boxVisitor/home-visitor/home-visitor.component';
import { ContactVisitorComponent } from './boxVisitor/contact-visitor/contact-visitor.component';
import { ContactComponent } from './boxUser/contact/contact.component';
import { UserComponent } from './boxDeveloper/user/user.component';
import { SendedComponent } from './boxEvaluator/sended/sended.component';
import { AwardComponent } from './boxUser/award/award.component';
import { MyPaperComponent } from './boxUser/my-paper/my-paper.component';
import { AllPaperComponent } from './boxUser/all-paper/all-paper.component';
import { userGuard } from './guard/user.guard';
import { visitorGuard } from './guard/visitor.guard';
import { evaluatorGuard } from './guard/evaluator.guard';
import { RegisterComponent } from './boxUser/register/register.component';
import { PaperComponent } from './boxUser/paper/paper.component';
import { CertificateComponent } from './boxUser/certificate/certificate.component';
import { ContactMassageComponent } from './boxDeveloper/contact-massage/contact-massage.component';
import { GradeFinalComponent } from './boxEvaluator/gradeFinal/grade-final.component';
import { TestComponent } from './boxDeveloper/test/test.component';
import { ManageWelcomeComponent } from './boxDeveloper/manage-welcome/manage-welcome.component';
import { SetEvaluatorComponent } from './boxDeveloper/set-evaluator/set-evaluator.component';

export const routes: Routes = [
    { path: '', component:HomeVisitorComponent, pathMatch:'full' },

    // User
    { path: 'home', component:HomeComponent, canActivate:[userGuard] },
    { path: 'contact', component:ContactComponent, canActivate:[userGuard] },
    { path: 'allPaper', component:AllPaperComponent, canActivate:[userGuard] },
    { path: 'myPaper', component:MyPaperComponent, canActivate:[userGuard] },
    { path: 'award', component:AwardComponent, canActivate:[userGuard] },
    { path: 'user', component:UserComponent, canActivate:[userGuard] },
    { path: 'paper', component:PaperComponent, canActivate:[userGuard] },
    { path: 'paper-eva', component:PaperComponent, canActivate:[userGuard] },
    { path: 'certificate', component:CertificateComponent, canActivate:[userGuard] },

    // Register
    { path: 'register', component:RegisterComponent, canActivate:[registerGuard] },

    // Evaluator
    { path: 'sended', component:SendedComponent, canActivate:[evaluatorGuard] },
    { path: 'grade', component:GradeComponent, canActivate:[evaluatorGuard] },
    { path: 'gradeFinal', component:GradeFinalComponent, canActivate:[evaluatorGuard] },

    // Developer
    { path: 'user', component:UserComponent, canActivate:[developerGuard] },
    { path: 'contactMassage', component:ContactMassageComponent, canActivate:[developerGuard] },
    { path: 'manageWelcome', component:ManageWelcomeComponent, canActivate:[developerGuard] },
    { path: 'setEvaluator', component:SetEvaluatorComponent, canActivate:[developerGuard] },

    // Visitor
    { path: 'home-visitor', component:HomeVisitorComponent, canActivate:[visitorGuard] },
    { path: 'callForPaper-visitor', component:CallForPaperComponent, canActivate:[visitorGuard] },
    { path: 'contact-visitor', component:ContactVisitorComponent, canActivate:[visitorGuard] },
    { path: 'signin', component:SigninComponent, canActivate:[visitorGuard] },
    { path: 'signup', component:SignupComponent, canActivate:[visitorGuard] },

    { path: '**', component:HomeVisitorComponent }
];
