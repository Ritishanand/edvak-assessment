import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ScrollConstants } from './app.component.constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  query: string = '';
  suggestions: string[] = [];
  currentPage: number = 1;
  limit: number = 6;
  hasMoreData: boolean = true;
  loadingMore: boolean = false;
  isLoading: boolean = false;
  constants = ScrollConstants;


  constructor(private http: HttpClient) {}

  onInput() {
    this.fetchSuggestions(this.query, 1).subscribe((data: any) => {
      this.suggestions = data.results;
    });
  }

  fetchSuggestions(query: string, page: number) {
    const url = `http://localhost:3000/suggestions?q=${query}&page=${page}&limit=${this.limit}`;
    return this.http.get<string[]>(url);
  }

  onScroll() {
    const container = document.querySelector('.suggestions-container');
    const threshold = 5;
    if (
      container &&
      !this.loadingMore &&
      this.hasMoreData &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - threshold
    ) {
      this.loadingMore = true;
      this.currentPage++;

      this.fetchSuggestions(this.query, this.currentPage).subscribe(
        (moreSuggestions: any) => {
          this.suggestions = [...this.suggestions, ...moreSuggestions.results];
          this.hasMoreData = moreSuggestions.results.length === this.limit;
          this.loadingMore = false;
        }
      );
    }
  }
}
