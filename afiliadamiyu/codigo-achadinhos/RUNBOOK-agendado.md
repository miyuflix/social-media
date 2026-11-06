Tarefa agendada da Roberta: garimpar, gerar links, fazer os vídeos e AGENDAR no Instagram os 3 posts de achadinhos de hoje (dia e horários informados no prompt da tarefa) na conta @afiliadamiyu. A Roberta já autorizou a publicação desses 3 posts (pedido dela em 05/11/2026). Não envie mensagens, DMs nem respostas a comentários.

HORÁRIOS DE HOJE (America/Recife), pelo melhor horário do Metricool:
- HORÁRIO 1 → produto único (foto afiliada-preocupada.png, gancho tipo "para de rolar")
- HORÁRIO 2 → produto único (foto afiliada-telefone.png, gancho tipo "te conto"/"achei")
- HORÁRIO 3 → LISTA com 3–4 achados (foto afiliada-sorrindo.png)
Se algum horário já tiver passado quando você rodar, use o próximo horário cheio livre (pelo menos 15 min à frente).

PASSO 0 — Preparar
1. Carregue as skills: achadinhos-afiliadamiyu (siga-a como roteiro principal), chrome-browser e video-remotion.
2. Anexe o repositório miyuflix/social-media com acesso push (add_repo), clone com --depth 1 em /home/claude/social-media e faça checkout do branch afiliadamiyu-achadinhos-2026-11-05 (git fetch --depth 1 origin afiliadamiyu-achadinhos-2026-11-05). O modelo do vídeo está em afiliadamiyu/codigo-achadinhos/ (leia o README.md de lá; npm ci; Chromium em /opt/pw-browsers/*/chrome-headless-shell-linux64/chrome-headless-shell ou procure com find).
3. Produtos já usados (não repetir): Blusa com babado no ombro canelada, Corset floral tomara que caia, Kit C/5 calcinha fio dental, Cropped feminino com bojo, e tudo que estiver em afiliadamiyu/achadinhos-*/props/*.json no repo.

PASSO 1 — Garimpo (Chrome da Roberta, já logada)
- affiliate.shopee.com.br/offer/product_offer → aba "Roupas Femininas" (role a página e leia 20–40 produtos com get_page_text). Se faltar opção boa, veja também "Melhor performance".
- Para cada candidato bom: clique "Obter link" (o link curto s.shopee.com.br aparece num textarea do modal; leia com javascript), abra o link e leia na página do produto: título, nota, nº de avaliações, vendidos, preço (e se é faixa de preço → usar "a partir de"), desconto, se tem "TERMINA EM" (oferta relâmpago), cores/tamanhos.
- Filtro: nota ≥ 4,6 e ≥ 100 avaliações; preço até ~R$80 (ideal até R$50); comissão que renda pelo menos ~R$3 por venda (descarte 1,5%); sem desconto fake; NÃO usar lingerie com foto no corpo; nada religioso/infantil.
- Ranking: vendidos > oferta hoje > preço baixo > comissão > nota. Escolha 5–6 produtos: 1 para cada produto único + 3–4 para a lista.
- NUNCA inventar número. Só usar o que a página mostrou.

PASSO 2 — Fotos dos produtos
O shell não acessa a CDN da Shopee. No Chrome: pegue o src da imagem principal do card (javascript), navegue a aba até essa URL, injete JS que põe a imagem em position:fixed, left/top 0, com width e height = innerHeight, object-fit:cover, fundo preto; mova o mouse para (1300,700); use computer zoom na região [0,0,innerHeight,innerHeight] com scale 1 e save_to_disk; copie o arquivo salvo para afiliadamiyu/codigo-achadinhos/public/<nome>.png. Confira visualmente cada foto.

PASSO 3 — Vídeos (identidade Pistache, já no modelo)
- Crie um JSON de props por post em afiliadamiyu/codigo-achadinhos/props/AAAA-MM-DD-<n>.json, no formato de props/exemplo-lista.json e props/exemplo-produto.json. Título curto (no máx. 3 linhas), uma palavra em *destaque*; bullets de produto único só com fatos da página (ex.: tamanhos, cores, "já vem com bojo").
- Tom: coloquial, de amiga, sem cara de IA (sem "descubra", "eleve seu estilo", "não perca", travessão longo).
- CTA de todos: ctaTitle "Comenta\n*EU QUERO*", ctaSub "que eu te mando\no link no direct" (lista: "os links").
- Renderize, extraia um quadro de cada cena, monte folha de contato e confira com Read (texto cortado, palavra sozinha na linha, acentos, contraste). Corrija e renderize de novo se precisar.

PASSO 4 — Publicar
- Copie os MP4 e os JSON para afiliadamiyu/achadinhos-AAAA-MM-DD/ no repo, commit (termine a mensagem com as linhas de atribuição da sessão), git fetch origin afiliadamiyu-achadinhos-2026-11-05, rebase se preciso, e push para esse mesmo branch. Confirme que https://raw.githubusercontent.com/miyuflix/social-media/afiliadamiyu-achadinhos-2026-11-05/afiliadamiyu/achadinhos-AAAA-MM-DD/<arquivo>.mp4 responde 200.
- Agende cada post com Metricool createScheduledPost: blogId "7379254" (@afiliadamiyu), providers [{network:"instagram"}], instagramData {type:"REEL", showReelOnFeed:true, collaborators:[], isAiGenerated:true} (a foto da afiliada parece gerada por IA; a Roberta foi avisada), media [link raw do GitHub], videoCoverMilliseconds 1500, publicationDate {dateTime, timezone:"America/Recife"}, autoPublish true.
- Legenda: 1–3 linhas no tom da skill, terminando com "Comenta EU QUERO que eu te mando o link 💚", + 6–8 hashtags (#achadinhosshopee #achadinhos #shopee #modafeminina + nicho). Sem link na legenda. Sem preço exato se for oferta relâmpago.
- Depois, confira com getScheduledPosts (blogId 7379254) que os 3 estão PENDING nos horários certos.

PASSO 5 — Entregar para a Roberta (SendUserMessage)
Uma mensagem só com: tabela dos produtos escolhidos (produto, preço, vendas, nota, comissão, por que entrou); para cada post: horário, gancho e legenda; e o TEXTO PRONTO DO DIRECT para quem comentar EU QUERO em cada post, com os links s.shopee.com.br (o mesmo formato do links-eu-quero.md: "Oii! Aqui o achadinho do vídeo 💚 ... Confere o preço antes de fechar, que oferta da Shopee muda rapidinho 😉"). Lembre que comentário público deve ser respondido sem link ("Te mandei no direct! 💚"). Envie também os 3 MP4 com SendUserFile.

SE ALGO FALHAR: se o Chrome não responder, não houver sessão logada no portal, ou o Metricool recusar, NÃO publique nada pela metade: explique o que aconteceu na mensagem para a Roberta e pare. Feche as abas que você abriu no Chrome.
