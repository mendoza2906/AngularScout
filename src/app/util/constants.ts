/**
 * LVT Constantes globales
 */
export class Constants {
    public static HTTP_NOT_FOUND_ERROR_CODE = 404;

    public static ESTADO_EJECUCION_POR_EJECUTAR = 'P';
    public static ESTADO_EJECUCION_EJECUTADA = 'E';
    public static ESTADO_EJECUCION_CANCELADA_DOCENTE = 'D';
    public static ESTADO_EJECUCION_CANCELADA_REPRESENTANTE = 'R';

    public static MINUTOS_ATENCION_DEFECTO = 30;

    // GUI Use Constants
    public static CURRENT_SCHEDULE = '__CURRENT_SCHEDULE__';
    public static CURRENT_SCHEDULE_ASSISTANCE = '__CURRENT_SCHEDULE_ASSISTANCE__';
    public static CURRENT_SCORE = '__CURRENT_SCORE__';
    public static GENERIC_EDITING_OBJECT = '__GENERIC_EDITING_OBJECT__';
    public static MEETING_RESERVATION_DATA = '__MEETING_RESERVATION_DATA__';

    // Day of week constants
    public static DAY_OF_WEEK_SUNDAY = 1;
    public static DAY_OF_WEEK_MONDAY = 2;
    public static DAY_OF_WEEK_TUESDAY = 3;
    public static DAY_OF_WEEK_WEDNESDAY = 4;
    public static DAY_OF_WEEK_THURSDAY = 5;
    public static DAY_OF_WEEK_FRIDAY = 6;
    public static DAY_OF_WEEK_SATURDAY = 7;

    public static DAY_OF_WEEK_NAMES: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];

    public static NO_IMAGE_LOGO = 'assets/layout/images/no-image.png';

    public static ROLE_DIRECTIVO = 'ROLE_DIRECTIVO';
    public static ROLE_DOCENTE = 'ROLE_DOCENTE';
    public static ROLE_ADMINISTRATIVO = 'ROLE_ADMINISTRATIVO';
    public static ROLE_SUPERVISOR = 'ROLE_SUPERVISOR';
    public static ROLE_REPRESENTANTE = 'ROLE_REPRESENTANTE';
    public static OK = 'OK';

    public static DELETE_STATUS = 'X';
}
