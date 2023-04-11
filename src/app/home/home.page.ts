import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { IonicModule } from '@ionic/angular';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {
  map: Leaflet.Map;
  propertyList = [{
    lat: 0,
    long: 0,
    city: ""
  }];
  localizacao = {
    lat: 0,
    lng: 0
  };

  ionViewDidEnter() {
    Geolocation.getCurrentPosition().then(async coordenadas => {

      this.localizacao = {
        lat: coordenadas.coords.latitude,
        lng: coordenadas.coords.longitude
      };
      this.leafletMap();
    });

  }

  leafletMap() {

    this.map = new Leaflet.Map('mapId2').setView([this.localizacao.lat, this.localizacao.lng], 2);

    Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    const markPoint = Leaflet.marker([this.localizacao.lat, this.localizacao.lng]);
    markPoint.bindPopup('<p>Minha Localização.</p>').openPopup();
    this.map.addLayer(markPoint);

    fetch('./assets/data.json')
      .then(res => res.json())
      .then(data => {
        this.propertyList = data.properties;
        this.marcadores();
      })
      .catch(err => console.error(err));
  }

  marcadores() {
    for (const property of this.propertyList) {
      Leaflet.marker([property.lat, property.long]).addTo(this.map)
        .bindPopup(property.city);
    }
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}