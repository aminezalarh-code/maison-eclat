-- Auto-generated product seed. Run AFTER schema.sql.

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'reflet-lunaire', 'Reflet Lunaire', c.id, 169, 'Acier inoxydable', 'BLR-REFLET-LUNAIRE', 15,
       'Inspirée des reliefs naturels façonnés par le temps, cette parure joue avec la lumière grâce à ses courbes organiques et sa finition miroir. Son design sculptural révèle un éclat intense à chaque mouvement, pour une allure moderne, élégante et intemporelle.', 'Parure sculpturale à la finition miroir.', 4.9, 'active', true, false, 'Best Seller', 'assets/products/reflet-lunaire/1.jpeg'
from categories c where c.slug = 'sets'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/reflet-lunaire/1.jpeg', 0, true), ('assets/products/reflet-lunaire/2.jpeg', 1, false), ('assets/products/reflet-lunaire/3.jpeg', 2, false)) as v(url, ord, feat) on true
where p.slug = 'reflet-lunaire'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'petales-damour', 'Pétales d''Amour', c.id, 189, 'Acier inoxydable', 'BLR-PETALES-DAMOUR', 15,
       'Comme une fleur caressée par la lumière, Pétales d''Amour révèle toute la délicatesse de la féminité. Ses pétales aux nuances douces créent un jeu de lumière élégant et apportent une touche de poésie à chacune de vos tenues. Une création pensée pour traverser le temps avec grâce.', 'Parure florale, délicate et poétique.', 4.9, 'active', true, false, 'Best Seller', 'assets/products/petales-damour/1.jpeg'
from categories c where c.slug = 'sets'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/petales-damour/1.jpeg', 0, true), ('assets/products/petales-damour/2.jpeg', 1, false), ('assets/products/petales-damour/3.jpeg', 2, false), ('assets/products/petales-damour/4.jpeg', 3, false), ('assets/products/petales-damour/5.jpeg', 4, false), ('assets/products/petales-damour/6.jpeg', 5, false), ('assets/products/petales-damour/7.jpeg', 6, false)) as v(url, ord, feat) on true
where p.slug = 'petales-damour'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'lheritiere', 'L''Héritière', c.id, 259, 'Acier inoxydable', 'BLR-LHERITIERE', 15,
       'Plus qu''un bijou, L''Héritière est un symbole. Elle évoque les traditions précieuses, les souvenirs transmis et la beauté qui traverse les générations, sublimée par une touche contemporaine.', 'Une parure héritage, au raffinement contemporain.', 4.8, 'active', false, false, 'Limited', 'assets/products/lheritiere/1.jpeg'
from categories c where c.slug = 'sets'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/lheritiere/1.jpeg', 0, true), ('assets/products/lheritiere/2.jpeg', 1, false), ('assets/products/lheritiere/3.jpeg', 2, false), ('assets/products/lheritiere/4.jpeg', 3, false)) as v(url, ord, feat) on true
where p.slug = 'lheritiere'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'etoile-dor', 'Étoile d''Or', c.id, 89, 'Acier inoxydable', 'BLR-ETOILE-DOR', 15,
       'Née de l''inspiration des profondeurs marines, cette création célèbre la beauté rare de l''océan. Son étoile de mer, délicatement sculptée, incarne la grâce, la sérénité et la lumière des horizons infinis.', 'Boucles étoile de mer, éclat doré.', 4.8, 'active', false, true, 'New', 'assets/products/etoile-dor/1.jpeg'
from categories c where c.slug = 'earrings'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/etoile-dor/1.jpeg', 0, true), ('assets/products/etoile-dor/2.jpeg', 1, false)) as v(url, ord, feat) on true
where p.slug = 'etoile-dor'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'cygne-daurore', 'Cygne d''Aurore', c.id, 129, 'Acier inoxydable', 'BLR-CYGNE-DAURORE', 15,
       'Entre lumière et délicatesse, Cygne d''Aurore capture l''instant où les premiers rayons rencontrent l''eau calme. Un bijou raffiné qui sublime chaque tenue.', 'Collier cygne serti, raffiné et lumineux.', 4.8, 'active', true, false, 'Best Seller', 'assets/products/cygne-daurore/1.jpeg'
from categories c where c.slug = 'necklaces'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/cygne-daurore/1.jpeg', 0, true), ('assets/products/cygne-daurore/2.jpeg', 1, false), ('assets/products/cygne-daurore/3.jpeg', 2, false)) as v(url, ord, feat) on true
where p.slug = 'cygne-daurore'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'lien-damour', 'Lien d''Amour', c.id, 199, 'Acier inoxydable', 'BLR-LIEN-DAMOUR', 15,
       'Un cœur aux lignes entrelacées, symbole d''un lien unique qui ne se défait jamais. Lien d''Amour est une création délicate, pour porter près de soi ce qui compte le plus.', 'Parure cœur entrelacé, symbole d’un lien unique.', 4.8, 'active', false, true, 'New', 'assets/products/lien-damour/1.jpeg'
from categories c where c.slug = 'sets'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/lien-damour/1.jpeg', 0, true), ('assets/products/lien-damour/2.jpeg', 1, false), ('assets/products/lien-damour/3.jpeg', 2, false), ('assets/products/lien-damour/4.jpeg', 3, false), ('assets/products/lien-damour/5.jpeg', 4, false)) as v(url, ord, feat) on true
where p.slug = 'lien-damour'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'laureole', 'L''Auréole', c.id, 169, 'Acier inoxydable', 'BLR-LAUREOLE', 15,
       'L''Auréole célèbre la beauté des détails et l''éclat des instants précieux. Une création raffinée, où douceur et élégance ne font qu''un.', 'Parure cerclée de brillance, douce et élégante.', 4.7, 'active', true, false, 'Best Seller', 'assets/products/laureole/1.jpeg'
from categories c where c.slug = 'sets'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/laureole/1.jpeg', 0, true), ('assets/products/laureole/2.jpeg', 1, false), ('assets/products/laureole/3.jpeg', 2, false), ('assets/products/laureole/4.jpeg', 3, false)) as v(url, ord, feat) on true
where p.slug = 'laureole'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'linsaisissable', 'L''Insaisissable', c.id, 169, 'Acier inoxydable', 'BLR-LINSAISISSABLE', 15,
       'L''Insaisissable incarne la grâce de ce qui ne peut être retenu. Inspirée par la légèreté d''un papillon, cette création lumineuse accompagne chacun de vos mouvements avec finesse et raffinement.', 'Parure papillon, légère et lumineuse.', 4.7, 'active', false, true, 'New', 'assets/products/linsaisissable/1.jpeg'
from categories c where c.slug = 'sets'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/linsaisissable/1.jpeg', 0, true), ('assets/products/linsaisissable/2.jpeg', 1, false), ('assets/products/linsaisissable/3.jpeg', 2, false), ('assets/products/linsaisissable/4.jpeg', 3, false)) as v(url, ord, feat) on true
where p.slug = 'linsaisissable'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'lincontournable', 'L''Incontournable', c.id, 149, 'Acier inoxydable', 'BLR-LINCONTOURNABLE', 15,
       'L''Incontournable est ce bijou que l''on choisit sans hésiter, jour après jour. Ses délicats motifs, disponibles en blanc nacré ou en rose tendre, captent la lumière avec douceur et apportent une touche de grâce à chaque instant.', 'Collier motifs nacrés, à porter chaque jour.', 4.7, 'active', false, false, null, 'assets/products/lincontournable/1.jpeg'
from categories c where c.slug = 'necklaces'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/lincontournable/1.jpeg', 0, true), ('assets/products/lincontournable/2.jpeg', 1, false), ('assets/products/lincontournable/3.jpeg', 2, false), ('assets/products/lincontournable/4.jpeg', 3, false), ('assets/products/lincontournable/5.jpeg', 4, false)) as v(url, ord, feat) on true
where p.slug = 'lincontournable'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'lenvolee', 'L''Envolée', c.id, 169, 'Acier inoxydable', 'BLR-LENVOLEE', 15,
       'L''Envolée évoque la légèreté d''un papillon porté par le vent. Une création lumineuse pensée pour celles qui avancent avec confiance et liberté.', 'Collier ajouré, léger comme un envol.', 4.7, 'active', false, false, null, 'assets/products/lenvolee/1.jpeg'
from categories c where c.slug = 'necklaces'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/lenvolee/1.jpeg', 0, true), ('assets/products/lenvolee/2.jpeg', 1, false), ('assets/products/lenvolee/3.jpeg', 2, false)) as v(url, ord, feat) on true
where p.slug = 'lenvolee'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'a-coeur-ouvert', 'À Cœur Ouvert', c.id, 169, 'Acier inoxydable', 'BLR-A-COEUR-OUVERT', 15,
       'Trois cœurs, une seule émotion. À Cœur Ouvert incarne la force des sentiments sincères et la beauté d''un amour assumé. Une création raffinée, à porter comme une déclaration de douceur.', 'Collier lariat trois cœurs, sincère et raffiné.', 4.7, 'active', false, true, 'New', 'assets/products/a-coeur-ouvert/1.jpeg'
from categories c where c.slug = 'necklaces'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/a-coeur-ouvert/1.jpeg', 0, true), ('assets/products/a-coeur-ouvert/2.jpeg', 1, false), ('assets/products/a-coeur-ouvert/3.jpeg', 2, false)) as v(url, ord, feat) on true
where p.slug = 'a-coeur-ouvert'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'emeraude', 'Émeraude', c.id, 179, 'Acier inoxydable', 'BLR-EMERAUDE', 15,
       'Comme une promenade au cœur d''un jardin baigné de lumière, Émeraude célèbre la douceur de la nature. Chaque pierre semble capturer un fragment de verdure, transformant la simplicité en une élégance intemporelle.', 'Parure aux pierres vertes, inspirée de la nature.', 4.6, 'active', false, false, null, 'assets/products/emeraude/1.jpeg'
from categories c where c.slug = 'sets'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/emeraude/1.jpeg', 0, true), ('assets/products/emeraude/2.jpeg', 1, false)) as v(url, ord, feat) on true
where p.slug = 'emeraude'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'rosalia', 'Rosalia', c.id, 89, 'Acier inoxydable', 'BLR-ROSALIA', 15,
       'Comme un papillon au premier printemps, ce bijou célèbre la douceur, la liberté et la beauté des nouveaux départs. Une touche délicate à porter chaque jour.', 'Boucles papillon rosé, douces et printanières.', 4.6, 'active', false, true, 'New', 'assets/products/rosalia/1.jpeg'
from categories c where c.slug = 'earrings'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/rosalia/1.jpeg', 0, true)) as v(url, ord, feat) on true
where p.slug = 'rosalia'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'premier-regard', 'Premier Regard', c.id, 89, 'Acier inoxydable', 'BLR-PREMIER-REGARD', 15,
       'Il suffit parfois d''un seul regard pour que tout bascule. Son cœur en spirale évoque le tourbillon des premières émotions, tandis que ses rayons dorés symbolisent la lumière d''une rencontre qui éclaire l''instant.', 'Boucles soleil spiralé, à l’éclat doré.', 4.7, 'active', false, false, null, 'assets/products/premier-regard/1.jpeg'
from categories c where c.slug = 'earrings'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/premier-regard/1.jpeg', 0, true)) as v(url, ord, feat) on true
where p.slug = 'premier-regard'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'eclora', 'Éclora', c.id, 89, 'Acier inoxydable', 'BLR-ECLORA', 15,
       'La rencontre entre la délicatesse de l''ivoire et la noblesse de l''or. Une création intemporelle qui apporte une touche de lumière naturelle à toutes les silhouettes.', 'Boucles pétales ivoire et or.', 4.6, 'active', false, false, null, 'assets/products/eclora/1.jpeg'
from categories c where c.slug = 'earrings'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/eclora/1.jpeg', 0, true)) as v(url, ord, feat) on true
where p.slug = 'eclora'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select 'loceane', 'L''Océane', c.id, 69, 'Acier inoxydable', 'BLR-LOCEANE', 15,
       'Comme un coquillage délicatement déposé sur le sable, L''Océane capture la beauté de la mer et l''éclat du soleil. Une création pensée pour celles qui emportent un souffle d''océan partout avec elles.', 'Boucles coquillage doré, souffle marin.', 4.6, 'active', false, false, null, 'assets/products/loceane/1.jpeg'
from categories c where c.slug = 'earrings'
on conflict (slug) do nothing;
insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ('assets/products/loceane/1.jpeg', 0, true)) as v(url, ord, feat) on true
where p.slug = 'loceane'
  and not exists (select 1 from product_images pi where pi.product_id = p.id);

