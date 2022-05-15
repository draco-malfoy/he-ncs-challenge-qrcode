import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as QRCode from 'qrcode'
import { nanoid } from 'nanoid'
import { SERVER_ADDRESS, VALID_URL_REGEX } from '../constants/constants';
import { RedisService } from '../services/redis.service';

@Component({
  selector: 'app-qr-component',
  templateUrl: './qr-component.component.html',
  styleUrls: ['./qr-component.component.scss']
})
export class QrComponentComponent implements OnInit {

  urlForm: FormGroup;
  formStatus: boolean = false;
  shortURL: string = '';
  isUrlCopied: boolean = false;
  @ViewChild('qrCode', { static: false }) qrContainer!: ElementRef;

  // regex from here https://stackoverflow.com/a/9284473/9728769
  valueUrlRegex: RegExp = VALID_URL_REGEX;

  constructor(private changeDetector: ChangeDetectorRef, private redisService: RedisService) {
    this.urlForm = new FormGroup({
      url: new FormControl('https://google.com', Validators.pattern(this.valueUrlRegex))
    })

  }

  ngOnInit(): void {
    this.urlForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.formStatus = true;
        this.changeDetector.detectChanges();
        this.createQR(this.urlForm.controls.url.value)
      } else if (status === 'INVALID') {
        this.formStatus = false;
      }
    })
  }

  createQR(url: string): void {
    QRCode.toCanvas(url, { errorCorrectionLevel: 'H', scale: 8, margin: 0 }, (err, canvas) => {
      if (err) throw err
      const element = this.qrContainer.nativeElement
      element.innerHTML = ''
      element.appendChild(canvas)
      this.shortenURL(url);
    })
  }

  shortenURL(url: string): void {
    const hash = nanoid();
    this.shortURL = SERVER_ADDRESS + hash;
    const data = { original: url, shortened: this.shortURL }
    // this.redisService.save(data).subscribe();
  }

  copyShortURL(): void {
    navigator.clipboard.writeText(this.shortURL);
    this.isUrlCopied = true;
    setTimeout(() => { this.isUrlCopied = false }, 2000);
  }
}