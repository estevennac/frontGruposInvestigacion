import { Component, OnInit, Inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { UserApp } from 'src/app/types/userApp.types';
import { Usuario } from 'src/app/types/usuario.types';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
    selector: 'app-members',
    templateUrl: './externMemberForm.component.html',
    styleUrls: ['./creation-form.component.scss']
})
export class ExternMembersGroup implements OnInit {
    @ViewChild('apellidoInput') apellidoInput: ElementRef;  // Referencia al campo de apellido
    @Output() memberCreated: EventEmitter<Usuario> = new EventEmitter(); // Emisor para notificar al padre
    user: UserApp;
    usuarios: Usuario[] = [];
    miembro: FormGroup;
    isSearchClicked = false;
    userNotFound = false;
    currentUser: string;
    currentDate: Date = new Date();
    isSaved: boolean = false;
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UsuarioService,
        private authService: AuthService,
        public dialogRef: MatDialogRef<ExternMembersGroup>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.usuarios = data.usuarios;
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();
        this.miembro = this.fb.group({
            nombre: ['', Validators.required],
            correo: ['', [Validators.required, Validators.email]],
            cedula: ['', Validators.required],
            institucion: ['', Validators.required],
            grado: ['', Validators.required],
            nacionalidad: ['', Validators.required],
            genero: ['', Validators.required],
        });
    }

    onClickNo(): void {
        this.dialogRef.close();
    }

    guardarmiembro(): void {
        this.isLoading = true;
        const apellido = this.apellidoInput.nativeElement.value.toUpperCase();
        const nombre = this.miembro.get('nombre').value.toUpperCase();
        const nombreCompleto = `${apellido}, ${nombre}`;
        this.miembro.patchValue({ nombre: nombreCompleto });
        const userData: Usuario = this.miembro.value;
        userData.fechaCreacion = this.currentDate;
        userData.usuarioCreacion = this.currentUser;

        this.userService.createUser(userData).subscribe(
            (response) => {
                this.isSaved = true;
                this.isLoading = false;
                userData.id = response;
                this.memberCreated.emit(userData); // Emitir el usuario creado
                this.dialogRef.close(); // Cierra solo este modal
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }
}
