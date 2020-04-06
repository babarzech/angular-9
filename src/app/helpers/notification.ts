import { NotificationHelper } from './notificationhelper';
declare var $: any;
export class Notification {
    public static cn;
    public static send(heading: string, message: string, type: NotificationType, timeout = 60, args= null) {
        if (typeof this.cn === 'undefined') {
            this.cn = 1;
            $('body').on('click', '#notification-panel .notif_msg .close', function () {
                $(this).closest('.notif_msg').fadeOut(100, function () {
                    $(this).remove();
                });
            });
        }
        this.cn += 1;
        const cls = 'notifmsg_' + this.cn;
        $('#notification-panel').prepend('<div class="notif_msg ' + type + ' ' + cls + '">' +
            '<div class="close"><i class="material-icons">close</i></div>' +
            '<i class="material-icons">notifications_active</i>' +
            '<span>' +
          '<h5>' + NotificationHelper.getMessageTranslation(heading) + '</h5>' +
          '<p>' + NotificationHelper.getMessageTranslation(message, args) + '</p>' +
            '</span>' +
            '</div>');
        setTimeout(function () {
            $('#notification-panel').find('.' + cls).fadeOut(function () {
                $(this).remove();
            });
        }, timeout * 200);
    }
}

export enum NotificationType {
    Info = 'info',
    Success = 'success',
    Danger = 'danger'
}
