import { Component, inject, OnInit } from '@angular/core';
import { MovieDto, MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {MatDialog} from "@angular/material/dialog";
import { UpdateMovieComponent } from '../update-movie/update-movie.component';
import { DeleteMovieComponent } from '../delete-movie/delete-movie.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  movies: MovieDto[] = [];

  movieService = inject(MovieService);
  authService = inject(AuthService);
  matDialog = inject(MatDialog);

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      this.getAllMovies();
    }
  }

  getAllMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (response) => {
        console.log("response = ", response);
        this.movies = response;
      },
      error: (err) => {
        console.log("err = ", err);
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  update(movie: MovieDto) {
    console.log("update movie : ", movie);

    const dialogRef = this.matDialog.open(UpdateMovieComponent, {
      data: {movie: movie},
    });

    dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result) {
          this.getAllMovies();
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  delete(movie: MovieDto) {
    console.log("delete movie : ", movie);

    const dialogRef = this.matDialog.open(DeleteMovieComponent, {
      data: {movie: movie},
    });

    dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result) {
          this.getAllMovies();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
