import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  fecha: moment.Moment = moment();
  resevar: string;
  diaArray: Array<Number> = [];
  diasForm: FormGroup;
  numeroDias: Number;

  constructor(private fb: FormBuilder) {
    this.rangoFechas();
  }

  rangoFechas() {
    return this.diasForm = this.fb.group({
      desde: [null, Validators.required],
      hasta: [null, Validators.required]
    })
  }

  ngOnInit() {
    this.diaArray = this.crearCalendario(this.fecha);
  }

  // CREDITOS A Bigles27
  crearCalendario(mes) {
    let firstDay = moment(mes).startOf('M');
    let days = Array.apply(null, { length: mes.daysInMonth() })
      .map(Number.call, Number)
      .map(n => {
        return moment(firstDay).add(n, 'd');
      });

    for (let n = 0; n < firstDay.weekday(); n++) {
      days.unshift(null);
    }
    return days;
  }

  diaActual(dia) {
    if (!dia) {
      return false;
    }
    return moment().format('L') === dia.format('L');
  }

  diaSelecionado(dia) {
    let diaformateado = dia.format('L')
    if (!this.diasForm.get('desde').value && dia.isSameOrAfter(moment().format('L'))) {
      this.diasForm.get('desde').patchValue(diaformateado)
    } else if (dia.isSameOrAfter(this.diasForm.value.desde)) {
      this.diasForm.get('hasta').patchValue(diaformateado)
    }

  }

  selecionarFechas(dia) {

    if (!dia) {
      return false
    }
    let desde = moment(this.diasForm.value.desde, 'L');
    let hasta = moment(this.diasForm.value.hasta, 'L');


    if (desde.isBefore(moment().format('L'))) {
      return false;
    }
    if (this.diasForm.valid) {
      return (desde.isSameOrBefore(dia) && hasta.isSameOrAfter(dia));
    }
    if (desde.isSameOrBefore(dia)) {
      return desde.isSame(dia);
    }

  }

  mesSiguiente() {
    this.fecha.add(1, 'M');
    this.diaArray = this.crearCalendario(this.fecha);
  }

  mesAnterior() {
    this.fecha.subtract(1, 'M');
    this.diaArray = this.crearCalendario(this.fecha);
  }

  reservar() {
    let desde = moment(this.diasForm.value.desde, 'L');
    let hasta = moment(this.diasForm.value.hasta, 'L');

    if (this.diasForm.valid && hasta.isSameOrAfter(desde)) {
      this.numeroDias = this.cantidadDias(desde, hasta);
      this.resevar = `reservado en ${this.diasForm.value.desde} - ${this.diasForm.value.hasta} --- 
      cantidad dias reservados : ${this.numeroDias}`;

      this.diasForm.reset();
    }
    setTimeout(() => {
      this.resevar = '';
      this.numeroDias = 0;
    }, 3000);
  }


  cantidadDias(desde: moment.Moment, hasta: moment.Moment) {
    if (this.diasForm.invalid) return;

    if (desde.format('L') == hasta.format('L')) {
      return 1;
    }

    let diasReservados = desde.diff(hasta, 'days');
    let result = Math.abs(diasReservados) + 1;

    return result;
  }
}
