export class Rules {

    // public static Email = '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,8}$';
    // public static Email = '^[a-zA-Z]+([.-_%+]?[a-zA-Z0-9]+)*@([a-zA-Z]+([.-]?[a-zA-Z]))(([.]{1}[a-zA-Z]{2,8})){1,}$';
    // public static Email =  '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    // public static Email = '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z0-9]{1,12}$';
    // public static Email = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    // tslint:disable-next-line: max-line-length
    // public static Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    public static Password = '(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$'; // '.{8,50}';
    public static Code = '[0-9]{6,6}';
    public static CodeMaxLength = 6;
    public static Phone = '[0-9]{7,15}';
    public static PhoneMaxLength = 15;
    public static AntiPhishingcode = '^([0-9a-zA-Z]{4,16})$';
    // public static ZipCode = '[0-9]{4,16}';
    // public static City = '^[A-Za-z-\s]{3,75}$';
    // public static Street = '^[A-Za-z0-9,-\s]{5,150}$';
    public static ZipCode = '^(?=.{4,16}$)(?!.*[.!@()+&{}^%$#><:"|,?])[\\s\\S]+(?<![.!@()+&{}^%$#><:"|,?])$';
    // public static City = '^(?=.{3,75}$)(?!.*[_!@()+&{}^%$><:"|,?])[\\s\\S]+(?<![_!@()+&{}^%$><:"|,?])$';
    public static Street = '^(?=.{5,150}$)(?!.*[_.!@()+&{}^%$><:"|?])[\\s\\S]+(?<![_.!@()+&{}^%$><:"|?])$';
    // public static Street =
}
