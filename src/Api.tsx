import {API_KEY, API_URL} from './Constant';

const genresCollection = {
  12: 'Aventure',
  14: 'Fantastique',
  16: 'Animation',
  18: 'Drama',
  27: 'Horreur',
  28: 'Action',
  35: 'Comédie',
  36: 'Histoire',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentaire',
  878: 'Science-Fiction',
  9648: 'Mystère',
  10402: 'Musique',
  10749: 'Romance',
  10751: 'Familial',
  10752: 'Guerre',
  10770: 'Téléfilm',
};

export const getImagePath = (path: string) =>
  `https://image.tmdb.org/t/p/w440_and_h660_face${path}`;
export const getBackdropPath = (path: string) =>
  `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;
export const getImage = (path: string) =>
  `https://image.tmdb.org/t/p/original${path}`;

export const getNowPlayingMovies = async () => {
  let movies: Array<any>;
  await fetch(API_URL)
    .then(res => res.json())
    .then(result => {
      movies = result.results.map(
        ({
          id,
          title,
          poster_path,
          backdrop_path,
          vote_everage,
          overview,
          release_date,
          genre_ids,
        }: {
          id: number;
          title: string;
          poster_path: string;
          backdrop_path: string;
          vote_everage: number;
          overview: string;
          release_date: string;
          genre_ids: any;
        }) => ({
          key: String(id),
          title: title,
          poster: getImagePath(poster_path),
          backdrop: getBackdropPath(backdrop_path),
          rating: vote_everage,
          description: overview,
          releaseDate: release_date,
          genres: genre_ids.map(
            (genre: number) => (genresCollection as any)[genre],
          ),
        }),
      );
    });
  //@ts-ignore
  return movies;
};
