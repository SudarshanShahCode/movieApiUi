import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieDto, MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-movie',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-movie.component.html',
  styleUrl: './update-movie.component.css'
})
export class UpdateMovieComponent {

    movieId = this.data.movie.movieId!;
    poster = this.data.movie.poster!;

    title = new FormControl<string>(this.data.movie.title, Validators.required);
    director = new FormControl<string>(this.data.movie.director, Validators.required);
    studio = new FormControl<string>(this.data.movie.studio, Validators.required);
    movieCast = new FormControl<string>(this.data.movie.movieCast.join(", "), Validators.required);
    releaseYear = new FormControl<string>(this.data.movie.releaseYear.toString(), Validators.required);

    selectedFile: File | null = null;
    
    updateMovieForm: FormGroup;
    
    inlineNotification = {
        show: false,
        type: '',
        text: '',
      };
    
      constructor(
          @Inject(MAT_DIALOG_DATA) public data: {movie: MovieDto},
          private dialogRef: MatDialogRef<UpdateMovieComponent>,
          private formBuilder: FormBuilder,
          private authService: AuthService,
          private router: Router,
          private movieService: MovieService
        ) {
          this.updateMovieForm = this.formBuilder.group({
            title: this.title,
            studio: this.studio,
            director: this.director,
            movieCast: this.movieCast,
            releaseYear: this.releaseYear,
            poster: [null],
        });
      }

      onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
        this.updateMovieForm.patchValue({file: this.selectedFile});
      }

      updateMovie() {
        if(this.authService.isAuthenticated() && this.updateMovieForm.valid) {
          let movieCast = this.updateMovieForm.get("movieCast")?.value as string;
          const mvc = movieCast.split(",").map(e => e.trim()).filter(e => e.length > 0);

          const movieDto: MovieDto = {
            title: this.updateMovieForm.get("title")?.value,
            director: this.updateMovieForm.get("director")?.value,
            studio: this.updateMovieForm.get("studio")?.value,
            movieCast: mvc,
            releaseYear: this.updateMovieForm.get("releaseYear")?.value,
            poster: this.selectedFile ? this.updateMovieForm.get("poster")?.value : null,
          };

          this.movieService.updateMovieService(this.movieId, movieDto, this.selectedFile).subscribe({
            next: (response) => {
              console.log("movie data after update: ", response);
              this.inlineNotification = {
                show: true,
                type: 'Success',
                text: 'Movie updated!',
              };
            },
            error: (err) => {
              console.log("some error : ", err);
              this.inlineNotification = {
                show: true,
                type: 'Error',
                text: 'Some error occurred!',
              };
            },
            complete: () => {
              this.dialogRef.close(true);
            }
          });
        } else {
          console.log("form not valid ");
        }
      }  

      cancel() {
        this.dialogRef.close();
      }

}
