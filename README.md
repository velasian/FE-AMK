# AMK-PORTAL3.0

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and
 disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Akun Demo

Gunakan akun berikut untuk mencoba tampilan dashboard:

| Peran    | Email            | Kata Sandi  |
|----------|------------------|-------------|
| Admin    | admin@amk.com    | admin123    |
| Pegawai  | pegawai@amk.com  | pegawai123  |

## Manajemen Data Pegawai (Lokal)

- Data pegawai, termasuk email, kata sandi demo, dan field tambahan yang dibuat admin, tersimpan di browser melalui `localStorage`.
- Admin dapat menambah/mengubah/menghapus pegawai, mengatur jumlah baris per halaman (10, 20, 30, 40), mencari pegawai, dan membuat field biodata kustom yang otomatis tersedia di akun pegawai.
- Pegawai dapat memperbarui data yang relevan seperti kontak, alamat, rekening, kontak darurat, serta field tambahan yang ditambahkan admin. Field yang bersifat tetap seperti nomor pegawai tidak dapat diubah.
