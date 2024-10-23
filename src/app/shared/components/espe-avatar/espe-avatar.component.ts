import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from 'src/app/core/http/image/image.service';

@Component({
  selector: 'vex-espe-avatar',
  templateUrl: './espe-avatar.component.html',
  styleUrls: ['./espe-avatar.component.scss']
})
export class EspeAvatarComponent implements OnInit {
  @Input() idBanner: string;
  src: string;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    if (this.idBanner) {
      this.src = this.imageService.getUserImagePath(this.idBanner);
    }
  }
}
