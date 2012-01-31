foreach(ary, iter){
  var c = 0,
      len = ary.length,
      i = len % 8;
  // (len/8の余り)回, 回す
  if (i>0) do {
    iter(ary[c], c++, ary);
  } while (--i);
  i = +(len >> 3);
  // (len/8 の商)回, 回す
  if (i>0) do {
    iter(ary[c], c++, ary); iter(ary[c], c++,ary);
    iter(ary[c], c++, ary); iter(ary[c], c++,ary);
    iter(ary[c], c++, ary); iter(ary[c], c++,ary);
    iter(ary[c], c++, ary); iter(ary[c], c++,ary);
  } while (--i);
};
