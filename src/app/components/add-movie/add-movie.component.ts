import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieDto, MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css'
})
export class AddMovieComponent {

  title = new FormControl<string>('', Validators.required);
  director = new FormControl<string>('', Validators.required);
  studio = new FormControl<string>('', Validators.required);
  movieCast = new FormControl<string>('', Validators.required);
  releaseYear = new FormControl<string>('', Validators.required);

  selectedFile: File | null = null;

  addMovieForm: FormGroup;

  inlineNotification = {
    show: false,
    type: '',
    text: '',
  };

  constructor(private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private movieService: MovieService
    ) {
      this.addMovieForm = this.formBuilder.group({
        title: this.title,
        studio: this.studio,
        director: this.director,
        movieCast: this.movieCast,
        releaseYear: this.releaseYear,
        poster: [null, Validators.required],
      });
    }

    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
      this.addMovieForm.patchValue({file: this.selectedFile});
    }

    addMovie() {
      if(this.authService.isAuthenticated() && this.addMovieForm.valid) {
        let movieCast = this.addMovieForm.get('movieCast')?.value as string;
        const mvc = movieCast.split(",").map(e => e.trim()).filter(e => e.length > 0);

        const movieDto: MovieDto = {
          title: this.addMovieForm.get('title')?.value,
          director: this.addMovieForm.get('director')?.value,
          studio: this.addMovieForm.get('studio')?.value,
          movieCast: mvc,
          releaseYear: this.addMovieForm.get('releaseYear')?.value,
        }

        this.movieService.addMovieService(movieDto, this.selectedFile!).subscribe({
          next: (response) => {
            console.log("response = ", response);
            this.addMovieForm.reset();
          },
          error: (err) => {
            console.log("");
            this.router.navigate(['add-movie']);
            this.inlineNotification = {
              show: true,
              type: 'error',
              text: 'Some error while adding movie!',
            }
          }
        })
      } else if(!this.authService.isAuthenticated()) {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.inlineNotification = {
          show: true,
          type: 'error',
          text: 'Session expired! Please login again.',
        }
      } else {
        this.inlineNotification = {
          show: true,
          type: 'error',
          text: 'Please Enter all mandatory form fields!',
        }
      }
    }
}
