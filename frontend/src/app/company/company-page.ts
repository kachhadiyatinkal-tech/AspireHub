import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './company-page.html',
  styleUrl: './company-page.css',
})
export class CompanyPage {}
