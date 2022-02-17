export default class Validator {

    constructor() {
        this.errors = [];
    }

    static validate(fields, rules = []) {
        this.errors = []
        for (const key in fields) {
            rules.forEach((rule) => {
                switch (rule) {
                    case 'empty':
                        if (fields[key].length === 0) {
                            this.errors.push(`Le champ ${key} est vide !`)
                        }
                        break;
                    case 'specialChars':
                        if (fields[key].match(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g)) {
                            this.errors.push(`Le champ ${key} contient des caratères spéciaux`)
                        }
                        break;
                    case 'min':
                        if (fields[key].length < 3) {
                            this.errors.push(`Le champ ${key} est trop court (3 caractères minimum)`)
                        }
                        break;
                }
            })
        }
        return this.errors.length === 0
    }
}