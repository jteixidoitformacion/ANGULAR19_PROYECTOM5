import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type ExerciseId = 'formularios' | 'validaciones' | 'http' | 'rxjs' | 'reto';

interface Operator {
  id: number;
  nombre: string;
  correo: string;
}

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  selectedExercise: ExerciseId = 'formularios';
  loginMessage = '';
  portMessage = '';
  apiMessage = 'GET /usuarios preparado para consultar.';
  recoveryMessage = 'La conexión está estable. Aún no hay incidencias que recuperar.';
  finalMessage = '';
  retries = 0;
  fallbackActive = false;
  nextId = 3;

  readonly exercises: { id: ExerciseId; number: string; title: string }[] = [
    { id: 'formularios', number: '01', title: 'Formulario reactivo' },
    { id: 'validaciones', number: '02', title: 'Validaciones a medida' },
    { id: 'http', number: '03', title: 'HttpClient y CRUD' },
    { id: 'rxjs', number: '04', title: 'RxJS resistente' },
    { id: 'reto', number: '05', title: 'Reto integrador' }
  ];

  readonly loginForm = new FormGroup({
    usuario: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  readonly portForm = new FormGroup({
    puerto: new FormControl(8080, { nonNullable: true, validators: [Validators.required, Validators.min(1024), Validators.max(65535)] })
  });

  readonly registrationForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  apiUsers: Operator[] = [
    { id: 1, nombre: 'Marta Soler', correo: 'marta@itformacion.com' },
    { id: 2, nombre: 'Pau Vila', correo: 'pau@itformacion.com' }
  ];

  registeredUsers: Operator[] = [
    { id: 1, nombre: 'Operador Sistema', correo: 'operador@empresa.org' }
  ];

  selectExercise(id: ExerciseId): void {
    this.selectedExercise = id;
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginMessage = 'Revisa el identificador y usa una clave de al menos 6 caracteres.';
      return;
    }

    this.loginMessage = `Credenciales de ${this.loginForm.controls.usuario.value} verificadas correctamente.`;
  }

  checkPort(): void {
    this.portForm.markAllAsTouched();
    this.portMessage = this.portForm.valid
      ? `El puerto ${this.portForm.controls.puerto.value} está disponible para servicios de usuario.`
      : 'El puerto debe estar entre 1024 y 65535.';
  }

  addApiUser(): void {
    const id = this.nextId++;
    this.apiUsers = [...this.apiUsers, { id, nombre: `Operador ${id}`, correo: `operador${id}@itformacion.com` }];
    this.apiMessage = `POST /usuarios: creado el operador ${id}.`;
  }

  updateApiUser(): void {
    const firstUser = this.apiUsers[0];
    if (!firstUser) {
      return;
    }

    this.apiUsers = [{ ...firstUser, nombre: `${firstUser.nombre} · actualizado` }, ...this.apiUsers.slice(1)];
    this.apiMessage = `PUT /usuarios/${firstUser.id}: el primer registro se ha actualizado.`;
  }

  deleteApiUser(): void {
    const lastUser = this.apiUsers[this.apiUsers.length - 1];
    if (!lastUser) {
      this.apiMessage = 'DELETE /usuarios: no quedan registros que eliminar.';
      return;
    }

    this.apiUsers = this.apiUsers.slice(0, -1);
    this.apiMessage = `DELETE /usuarios/${lastUser.id}: registro eliminado.`;
  }

  runFallback(): void {
    this.fallbackActive = true;
    this.recoveryMessage = 'GET /api/avisos ha fallado. catchError() devuelve [] y la interfaz continúa disponible.';
  }

  retryRequest(): void {
    this.retries += 1;
    this.fallbackActive = false;
    this.recoveryMessage = `Intento ${this.retries} de 2: retry() ha reanudado la solicitud.`;
  }

  registerUser(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.finalMessage = 'Completa el nombre y un correo con formato válido antes de guardar.';
      return;
    }

    const { nombre, correo } = this.registrationForm.getRawValue();
    this.registeredUsers = [{ id: this.registeredUsers.length + 1, nombre, correo }, ...this.registeredUsers];
    this.registrationForm.reset();
    this.finalMessage = 'Operador registrado y preparado para enviar a la API mock.';
  }
}