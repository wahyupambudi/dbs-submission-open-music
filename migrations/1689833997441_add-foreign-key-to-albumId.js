exports.up = (pgm) => {
  /**
   * 1. @TODO
   * Tambahan constraint foreign key pada:
   *  - Tabel: songs
   *  - Kolom: album_id
   *  - Mengarah ke:
   *     - Tabel: albums
   *     - Kolom: id
   *
   * Referensi: https://www.dicoding.com/academies/271/tutorials/17394
   */

  pgm.addConstraint(
    "songs",
    "fk_songs.album_id_albums.id",
    "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("songs", "fk_songs.album_id_albums.id");
};
