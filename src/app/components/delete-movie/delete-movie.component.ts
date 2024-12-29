import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MovieDto, MovieService } from '../../services/movie.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-movie',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './delete-movie.component.html',
  styleUrl: './delete-movie.component.css'
})
export class DeleteMovieComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {movie: MovieDto},
    private dialogRef: MatDialogRef<DeleteMovieComponent>,
    private authService: AuthService,
    private movieService: MovieService,
  ) {
  }

  delete() {
    if(this.authService.isAuthenticated()) {
      this.movieService.deleteMovieService(this.data.movie.movieId!).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.dialogRef.close(true);
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
