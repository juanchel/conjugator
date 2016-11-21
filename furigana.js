var split_reverse = function(str)
{
  return str.split('').reverse();
};

var addFurigana = function(kanji, kana)
{
  var rkanji = split_reverse(kanji)
  var rkana = split_reverse(kana)
  var out = [];
  var j, n;
  var kbucket = [];
  var kactive = ''
  var close = false
  while( (rkanji.length && rkana.length) || kactive)
  {
    j = '';
    if (rkanji.length)
    {
      j = rkanji.shift();
    }
    else
    {
        close = true;
    }

    n = '';
    if(rkana.length)
    {
      n = rkana.shift();
    }

    if ((n && j.localeCompare(n) == 0) || close)
    {
      if(close && n)
      {
          kbucket.unshift(n);
          continue;
      }

      if(kactive)
      {
        out.unshift(toRuby(kactive, kbucket));
        kactive = '';
        kbucket = [];
      }
      out.unshift(n);
    }
    else
    {
      if (!kactive) kactive = j;
      kbucket.unshift(n);
    }
  }

  return out.join('');
};

var toRuby = function(kanji, kana)
{
  var out = ['<ruby>', kanji, '<rt>'];
  kana.forEach(function(k)
  {
    out.push(k);
  })
  out.push('</rt></ruby>');
  return out.join('');
};
