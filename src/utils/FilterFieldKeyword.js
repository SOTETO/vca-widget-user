import XDate from 'xdate';

function parseMDY(str) {
  // this example parses dates like "month/date/year"
  var parts = str.split('/');
  if (parts.length == 3) {
    return new XDate(
      parseInt(parts[2]), // year
      parseInt(parts[0] ? parts[0]-1 : 0), // month
      parseInt(parts[1]) // date
    );
  }
}

function parseGerman(str) {
  // parses dates like "day.month.year"

  var parts = str.split('.');
  if (parts.length === 3) {
    return new XDate(
      parseInt(parts[2]), // year
      parseInt(parts[1] - 1), // month
      parseInt(parts[0]) // date
    );
  } else if (parts.length === 2) {
    return new XDate(
      parseInt(parts[1]),
      parseInt(parts[0] - 1),
      1
    )
  } else if (parts.length === 1) {
    return new XDate(parseInt(parts[0], 1, 1))
  }
}

XDate.parsers.push(parseMDY);
XDate.parsers.push(parseGerman);

export default class FilterFieldKeyword {

  constructor (field, keyword, index = 1) {
    this.field = field
    this.keyword = keyword
    this.index = index
  }

  getName() {
    return this.field.name
  }

  getKeyword() {
    return this.keyword['keyword']
  }

  getQuery(offset = 0) {
    var number = offset + this.index
    return this.field.path + "." + number + "." + this.field.op
  }

  getValue(offset = 0) {
    var path = this.field.path.split(".")
    var values = {}
    values[path[0]] = {}

    return path.reduce((res, attr, i, fields) => {
      var pointer = res[fields[0]]
      for(var j = 1; j < i; j++) {
        pointer = pointer[fields[j]]
      }
      if(!pointer.hasOwnProperty(attr) && i !== 0) {
        pointer[attr] = {}
      }
      if(fields.length - 1 === i) {
        var number = offset + this.index
        pointer[attr]["" + number] = this.keyword['masked']
      }
      return res
    }, values)
  }

  equals(other) {
    return (typeof other !== "undefined") && other !== null && (typeof other.getName() !== "undefined") &&
      (typeof other.getKeyword() !== "undefined") && (this.getName() === other.getName() && this.getKeyword() === other.getKeyword())
  }

  static isDate (keyword, complete = false) {
    return keyword.match(FilterFieldKeyword.Match.date.pattern) ||
      (!complete && keyword.match(FilterFieldKeyword.Match.date.part.month)) ||
      (!complete && keyword.match(FilterFieldKeyword.Match.date.part.year))
  }

  static isPhoneNumber (keyword) {
    return keyword.match(FilterFieldKeyword.Match.phone.pattern)
  }

  static isGender (keyword) {
    return keyword.match(FilterFieldKeyword.Match.male.pattern) || keyword.match(FilterFieldKeyword.Match.female.pattern)
  }

  static isRole (keyword, special) {
    return FilterFieldKeyword.Match.roles
      .filter((role) => {
        var vm = role.name === "VolunteerManager" && special
        var notVm = role.name !== "VolunteerManager" && !special
        return vm || notVm
      })
      .reduce(((roleMatched, role) => keyword.match(role.pattern) || roleMatched), false)
  }


  static isPillar (keyword) {
    return FilterFieldKeyword.Match.pillar
      .reduce(((pillarMatched, pillar) => keyword.match(pillar.pattern) || pillarMatched), false)
  }

  static getString (keyword) {
    return keyword.split(" ").map(token => {
      return { "keyword": token, "masked": "%" + token + "%" }
    })
  }

  static getGender (keyword) {
    var res = 'female'
    if(keyword.match(FilterFieldKeyword.Match.male.pattern)) {
      res = 'male'
    }
    return [{ "keyword": keyword, "masked": res }]
  }

  static getPhone (keyword) {
    function unique(value, index, self) {
      return self.indexOf(value) === index;
    }
    var separated = keyword
        .split(/\s|-/)
        .filter(p =>
      (typeof p !== "undefined") &&
      !p.match(FilterFieldKeyword.Match.phone.removable.prefix) &&
      !p.match(FilterFieldKeyword.Match.phone.removable.countryCode)
  ).map(p => "%" + p + "%")
    return ([
      "%" + keyword + "%"
    ]).concat(separated).filter(unique).map(k => { return { "keyword": keyword, "masked": k }})
  }

  static getDate (keyword) {
    var range = -1
    var date = new XDate(keyword)
    if((typeof date !== "undefined") && date !== null && date !== NaN) {
      var range = [date.setHours(0).getTime(), date.setHours(23).getTime()]
      if(keyword.match(FilterFieldKeyword.Match.date.part.month)) {
        range = [date.setDate(1).setHours(0).getTime(), date.setDate(31).setHours(23).getTime()]
      } else if(keyword.match(FilterFieldKeyword.Match.date.part.year)) {
        range = [
          date.setMonth(0).setDate(1).setHours(0).getTime(),
          date.setMonth(11).setDate(31).setHours(23).getTime()
        ]
      }
    }
    return [{ "keyword": keyword, "masked": range }]
  }

  static getRole (keyword) {
    var res = [{ "keyword": keyword, "masked": "" }]
    var role = FilterFieldKeyword.Match.roles.find(role => keyword.match(role.pattern))
    if(role.hasOwnProperty("name")) {
      res = [{ "keyword": keyword, "masked": role.name }]
    }
    return res
  }

  static getPillar (keyword) {
    var res = [{ "keyword": keyword, "masked": "" }]
    var pillar = FilterFieldKeyword.Match.pillar.find(role => keyword.match(role.pattern))
    if(pillar.hasOwnProperty("name")) {
      res = [{ "keyword": keyword, "masked": pillar.name }]
    }
    return res
  }

  static getPhoneFields () {
    return FilterFieldKeyword.Fields.filter(field => field.type === "String" && field.name === "Supporter_mobilePhone")
  }

  static getDateFields () {
    return FilterFieldKeyword.Fields.filter(field => field.type === "Number" && (field.name === "Supporter_birthday" ||
      field.name === "User_created"))
  }

  static getGenderFields () {
    return FilterFieldKeyword.Fields.filter(field => field.type === "String" && field.name === "Supporter_sex")
  }

  static getRoleFields (special) {
    return FilterFieldKeyword.Fields.filter((field) =>
      ((field.type === "String" && field.name === "Supporter_Crew_role" && special) ||
      (field.type === "String" && field.name === "User_roles" && !special))
    )
  }

  static getPillarFields () {
    return FilterFieldKeyword.Fields.filter((field) =>
      (field.type === "String" && field.name === "Supporter_Crew_pillar")
    )
  }

  static getDefaultFields () {
    return FilterFieldKeyword.Fields.filter(field => field.type === "String" && field.name !== "Supporter_mobilePhone" && field.name !== "Supporter_Crew_active"  && field.name !== "Supporter_Crew_uuid" 
      field.name !== "Supporter_sex" && field.name !== "Supporter_Crew_role" && field.name !== "User_roles"  && field.name !== "Supporter_Crew_pillar")
  }
}

FilterFieldKeyword.Match = {
  'phone': {
    'name': 'phone',
    'pattern': /^([0-9]|-|\s)+$/,  // /^\(?(((\(?\+\d{2}\)?)(\s|-)?)|0)\d{2,5}\)?(\s|-)?([0-9]|-|\s)+$/,
    'removable': {
      'countryCode': /\(?\+\d{2}\)?(\s|-)? /,
      'prefix': /^\(?(((\(?\+\d{2}\)?)(\s|-)?)|0)\d{2,5}\)?/
    }
  },
  'date': {
    'name': 'date',
    'pattern': /^((\d{2}([./-]))?\d{2}([./-]))?\d{4}$/,
    'part': {
      'month': /^\d{2}([./-])\d{4}$/,
      'year': /^\d{4}$/
    }
  },
  'male': {
    'name': 'male',
    'pattern': /^((males?)|(m\u00e4nnlich)|(mann)|(m\u00e4nner)|(men)|(man))$/i
  },
  'female': {
    'name': 'female',
    'pattern': /^((females?)|(weiblich)|(frau)|(frauen)|(woman)|(women))$/i
  },
  'roles': [
    {
      'name': 'VolunteerManager',
      'pattern': /^(ASP)|(A(n(s(p(r(e(c(h(p(a(r(t(n(e(r)?)?)?)?)?)?)?)?)?)?)?)?)?)?)$/i
    },
    {
      'name': 'admin',
      'pattern': /^(admin)|(administrator)|(root)$/i
    },
    {
      'name': 'employee',
      'pattern': /^(employee(s)?)|(mitarbeiter(in(nen)?)?)|(hauptamt(lich(e(r)?)?)?)|(botschafter(in(nen)?)?)$/i
    }
  ],
  'pillar': [
    {
      'name': 'operation',
      'pattern': /^(aktion(en)?)|(action(s)?)$/i
    },
    {
      'name': 'education',
      'pattern': /^(bildung)|(education)$/i
    },
    {
      'name': 'finance',
      'pattern': /^(finanz(en)?)|(finance(s)?)$/i
    },
    {
      'name': 'network',
      'pattern': /^(netzwerk)|(network)$/i
    }
  ]
}


FilterFieldKeyword.Fields = [{
  "name": "Supporter_firstName",
  "path": "supporter.firstName",
  "op": "LIKE",
  "type": "String"
}, {
  "name": "Supporter_lastName",
  "path": "supporter.lastName",
  "op": "LIKE",
  "type": "String"
}, {
  "name": "Profile_email",
  "path": "profile.email",
  "op": "LIKE",
  "type": "String"
}, {
  "name": "User_created",
  "path": "user.created",
  "op": "BETWEEN", // Todo: LESS EQAUL und GREATER EQUAL
  "type": "Number"
}, {
  "name": "Supporter_placeOfResidence",
  "path": "supporter.placeOfResidence",
  "op": "LIKE",
  "type": "String"
}, {
  "name": "Supporter_mobilePhone",
  "path": "supporter.mobilePhone",
  "op": "LIKE", // Todo: Consider +49 (country code)
  "type": "String"
}, {
  "name": "Supporter_birthday",
  "path": "supporter.birthday",
  "op": "BETWEEN", // Todo: Use the Age (Year with Less equal and greater equal)
  "type": "Number"
}, {
  "name": "Supporter_sex",
  "path": "supporter.sex",
  "op": "=", // Todo: transform input in possible values!
  "type": "String"
}, {
  "name": "Supporter_Crew_name",
  "path": "supporterCrew.name",
  "op": "LIKE",
  "type": "String"
}, { // TODO 
  "name": "Supporter_Crew_uuid",
  "path": "supporterCrew.uuid",
  "op": "=",
  "type": "String"
}, {
  "name": "Supporter_Crew_active",
  "path": "supporterCrew.active",
  "op": "=",
  "type": "String"
}, {
  "name": "Supporter_Crew_role",
  "path": "supporterCrew.role",
  "op": "=",
  "type": "String"
}, {
  "name": "User_roles",
  "path": "user.roles",
  "op": "LIKE",
  "type": "String"
}, {
  "name": "Supporter_Crew_pillar",
  "path": "supporterCrew.pillar",
  "op": "=",
  "type": "String"
}]
