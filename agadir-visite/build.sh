#!/usr/bin/env bash
# Assembles static pages from partials/head.html + partials/content/<page> + partials/foot.html
# Final HTML is self-contained (no server needed). Re-run after editing any partial.
set -e
cd "$(dirname "$0")"

build() {
  local page="$1" title="$2" desc="$3" slug="$4"
  sed -e "s#__TITLE__#${title}#g" -e "s#__DESC__#${desc}#g" -e "s#__SLUG__#${slug}#g" partials/head.html > "$page"
  cat "partials/content/$page" >> "$page"
  cat partials/foot.html >> "$page"
  echo "built $page"
}

build excursions.html  "Excursions from Agadir — Day Trips and Tours | Agadir Visite"          "Discover our day excursions from Agadir and Taghazout: Marrakech, Essaouira, Legzira, the wildlife park, Taroudant and more. Comfort, local guides and pay on arrival." "excursions/"
build circuits.html    "Morocco Tourist Circuits — Multi-Day Tours | Agadir Visite"             "Multi-day circuits across southern Morocco and the Sahara: Zagora, Chegaga, Ouarzazate, Taroudant and the imperial cities. Built around comfort and safety." "circuits/"
build activities.html  "Activities and Experiences in Agadir | Agadir Visite"                   "Camel rides, quad biking, hammam, Berber massage, sea trips, dinner shows and hot air balloons around Agadir. Add a little magic to your stay." "activities/"
build transfers.html   "Agadir Airport Transfers and Private Drivers | Agadir Visite"           "Reliable airport and inter-city transfers in Agadir with private, English-speaking drivers. Fixed prices, meet and greet, and pay on arrival." "transfers/"
build vehicles.html    "Our Vehicles — Minibus, Minivan and 4x4 with Driver | Agadir Visite"    "Rent a Mercedes Vito or Sprinter, a Toyota Land Cruiser Prado or a Skoda Kodiaq with an experienced driver for your excursions and transfers in Morocco." "rental-with-driver-minibus-4x4/"
build golden-book.html "Golden Book — Traveller Reviews | Agadir Visite"                        "Read what our travellers say about their excursions, circuits and transfers with Agadir Visite. Rated Travellers Choice on Tripadvisor." "golden-book/"
build blog.html        "Travel Blog — Tips and Stories from Morocco | Agadir Visite"            "Travel tips, destination guides and stories to help you plan the perfect trip to Agadir and southern Morocco." "blog/"
build about.html       "Who We Are — About Agadir Visite"                                       "Agadir Visite is a local tourism agency offering authentic excursions, circuits, activities and transfers since 2005. Discover our story and values." "about/"
build contact.html     "Contact Agadir Visite — Book Your Excursion or Transfer"               "Get in touch to plan your excursion, circuit or airport transfer in Agadir. Phone, email, WhatsApp and our office address in Agadir, Morocco." "contact/"
build gallery.html     "Photo Gallery — Images and Souvenirs from Morocco | Agadir Visite"      "A gallery of landscapes, people and adventures from our excursions and circuits across Agadir and southern Morocco." "gallery/"
echo "All pages built."
