/**
 * variables de trabajo
 */
//Hice Cambios
// ============================================================
// RUTAS POR COLOR
// ============================================================
function verde () {
    avanzar(13)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(165)
    basic.pause(200)
    girarIzquierda90()
    basic.pause(200)
    avanzar(33)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(25)
    basic.showIcon(IconNames.Yes)
}
function amarillo () {
    avanzar(13)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(165)
    basic.pause(200)
    girarIzquierda90()
    basic.pause(200)
    avanzar(63)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(25)
    basic.showIcon(IconNames.Yes)
}
// ============================================================
// BOTONES
// A → cambia de modo (1=verde, 2=amarillo, 3=azul, 4=blanco)
// B → ejecuta la ruta del modo seleccionado
// ============================================================
input.onButtonPressed(Button.A, function () {
    modo += 1
    if (modo > 4) {
        modo = 1
    }
    basic.showNumber(modo)
})
// ============================================================
// GIROS — por encoder, no dependen de la línea ni la brújula
// ============================================================
function girarDerecha90 () {
    g = gradosGiroAMotor(90)
    nezhaV2.setServoSpeed(SPEED)
nezhaV2.__move(nezhaV2.MotorPostion.M1, nezhaV2.MovementDirection.CW, g, nezhaV2.SportsMode.Degree)
nezhaV2.__move(nezhaV2.MotorPostion.M4, nezhaV2.MovementDirection.CW, g, nezhaV2.SportsMode.Degree)
nezhaV2.motorDelay(g, nezhaV2.SportsMode.Degree)
}
function azul () {
    avanzar(13)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(165)
    basic.pause(200)
    girarIzquierda90()
    basic.pause(200)
    avanzar(17)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(25)
    basic.showIcon(IconNames.Yes)
}
// ============================================================
// AVANZAR — el ENCODER decide la distancia.
// El seguidor de línea SOLO corrige el centrado mientras avanza.
// State_0 = sensor sobre línea negra (LED apagado)
// ============================================================
function avanzar (cm: number) {
    gradosObjetivo = cmAGrados(cm)
    nezhaV2.resetRelAngleValue(nezhaV2.MotorPostion.M1)
    nezhaV2.resetRelAngleValue(nezhaV2.MotorPostion.M4)
    nezhaV2.setServoSpeed(SPEED)
avanceM1 = 0
    avanceM4 = 0
    while (avanceM1 < gradosObjetivo && avanceM4 < gradosObjetivo) {
        PlanetX_Basic.Trackbit_get_state_value()
        vL = SPEED
        vR = SPEED
        ch1_izq_extremo = PlanetX_Basic.TrackbitChannelState(PlanetX_Basic.TrackbitChannel.One, PlanetX_Basic.TrackbitType.State_0)
        ch2_izq_centro = PlanetX_Basic.TrackbitChannelState(PlanetX_Basic.TrackbitChannel.Two, PlanetX_Basic.TrackbitType.State_0)
        ch3_der_centro = PlanetX_Basic.TrackbitChannelState(PlanetX_Basic.TrackbitChannel.Three, PlanetX_Basic.TrackbitType.State_0)
        ch4_der_extremo = PlanetX_Basic.TrackbitChannelState(PlanetX_Basic.TrackbitChannel.Four, PlanetX_Basic.TrackbitType.State_0)
        // Sensores DERECHOS sobre línea → desvió a la IZQUIERDA → frenar M4
        // Sensores IZQUIERDOS sobre línea → desvió a la DERECHA → frenar M1
        if (ch3_der_centro || ch4_der_extremo) {
            if (ch4_der_extremo) {
                vR = SPEED - Math.round(CORRECCION * 1.5)
            } else {
                vR = SPEED - CORRECCION
            }
        } else if (ch1_izq_extremo || ch2_izq_centro) {
            if (ch1_izq_extremo) {
                vL = SPEED - Math.round(CORRECCION * 1.5)
            } else {
                vL = SPEED - CORRECCION
            }
        }
        // Si nadie ve la línea, vL y vR quedan en SPEED → avanza recto solo por encoder
        nezhaV2.start(nezhaV2.MotorPostion.M1, vL)
        nezhaV2.start(nezhaV2.MotorPostion.M4, 0 - vR)
        avanceM1 = Math.abs(nezhaV2.readRelAngle(nezhaV2.MotorPostion.M1))
        avanceM4 = Math.abs(nezhaV2.readRelAngle(nezhaV2.MotorPostion.M4))
        basic.pause(15)
    }
    nezhaV2.stop(nezhaV2.MotorPostion.M1)
    nezhaV2.stop(nezhaV2.MotorPostion.M4)
}
input.onButtonPressed(Button.B, function () {
    if (modo == 1) {
        verde()
    } else if (modo == 2) {
        amarillo()
    } else if (modo == 3) {
        azul()
    } else if (modo == 4) {
        blanco()
    }
})
function gradosGiroAMotor (anguloGiro: number) {
    arco = anguloGiro / 360 * Math.PI * distanciaRuedasEfectiva
    return Math.round(arco / circunferencia * 360)
}
function girarIzquierda90 () {
    h = gradosGiroAMotor(90)
    nezhaV2.setServoSpeed(SPEED)
nezhaV2.__move(nezhaV2.MotorPostion.M1, nezhaV2.MovementDirection.CCW, h, nezhaV2.SportsMode.Degree)
nezhaV2.__move(nezhaV2.MotorPostion.M4, nezhaV2.MovementDirection.CCW, h, nezhaV2.SportsMode.Degree)
nezhaV2.motorDelay(h, nezhaV2.SportsMode.Degree)
}
// ============================================================
// CONVERSIONES
// ============================================================
function cmAGrados (cm: number) {
    return Math.round(cm / circunferencia * 360)
}
function blanco () {
    avanzar(13)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(165)
    basic.pause(200)
    girarDerecha90()
    basic.pause(200)
    avanzar(8.5)
    basic.pause(200)
    girarIzquierda90()
    basic.pause(200)
    avanzar(22)
    basic.showIcon(IconNames.Yes)
}
let arco = 0
let ch4_der_extremo = false
let ch3_der_centro = false
let ch2_izq_centro = false
let ch1_izq_extremo = false
let vR = 0
let vL = 0
let avanceM4 = 0
let avanceM1 = 0
let gradosObjetivo = 0
let modo = 0
let CORRECCION = 0
let SPEED = 0
let distanciaRuedasEfectiva = 0
let circunferencia = 0
let h = 0
let g = 0
// ============================================================
// CONSTANTES FÍSICAS DEL ROBOT
// ============================================================
let DIAMETRO_RUEDA = 6.9
let DISTANCIA_RUEDAS_MEDIDA = 16
let FACTOR_CALIBRACION_GIRO = 0.89
circunferencia = DIAMETRO_RUEDA * Math.PI
distanciaRuedasEfectiva = DISTANCIA_RUEDAS_MEDIDA * FACTOR_CALIBRACION_GIRO
SPEED = 50
CORRECCION = 8
nezhaV2.setComboMotor(nezhaV2.MotorPostion.M1, nezhaV2.MotorPostion.M4)
