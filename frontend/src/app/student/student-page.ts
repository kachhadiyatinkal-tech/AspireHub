import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-page.html',
  styleUrl: './student-page.css',
})
export class StudentPage {}
