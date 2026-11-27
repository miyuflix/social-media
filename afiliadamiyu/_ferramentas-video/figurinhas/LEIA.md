# Figurinhas da Miyu (memes)

PNG com fundo transparente e borda branca de adesivo, bonequinha do design system Afiliada Miyu.
A Roberta autorizou usar sempre que fizer sentido em posts, Reels e stories da @afiliadamiyu (26/11/2026).

| Arquivo | Frase | Quando usar |
|---|---|---|
| achei.png | ACHEI! | apresentar um achado |
| ta-caro.png | TÁ CARO | meme de preço alto, bordão "se não passou pela Miyu, tá caro" |
| corre.png | CORRE! tá no menor preço | peça que baixou de preço de verdade |
| so-vou-olhar.png | SÓ VOU OLHAR (mentira) | memes de Black Friday / carrinho |
| carrinho-cheio.png | CARRINHO CHEIO | colagem de vários produtos |
| tem-certeza.png | TEM CERTEZA? | formato "frase da seguidora + TEM CERTEZA?" |
| modo-black.png | MODO BLACK | posts da Black Friday |
| amei.png | AMEI | provador, feedback |
| chorando-no-pix.png | CHORANDO no pix | meme de "gastei tudo" |
| passa-o-link.png | PASSA O LINK no direct | perto da chamada "comenta PALAVRA" |

Regras: no máximo 1 figurinha por peça; nunca em cima do rosto, do produto ou do aviso "comenta PALAVRA";
em Reels, entra depois do gancho (de ~1 s até o fim) no canto livre, com ~260 px de largura, longe da lateral direita (botões do app) e da faixa de legenda.
Exemplo ffmpeg (canto superior direito, abaixo do carimbo):
ffmpeg -i entrada.mp4 -i figurinhas/corre.png -filter_complex "[1]scale=260:-1[f];[0][f]overlay=W-w-40:420:enable='gte(t,1)'" -c:a copy saida.mp4
