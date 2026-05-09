export interface Transaksi{
  id:number;
  waktu:string;
  jenis:'produksi'|'keras'|'penjualan'|'setorUang';
  jumlah:number;
  keterangan:string;
}
