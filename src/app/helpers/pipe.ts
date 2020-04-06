import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], term: any): any {
    // I am unsure what id is here. did you mean title?
      term = term ? term.toLocaleLowerCase() : null;
      return term ? items.filter(item => item.name.toLocaleLowerCase().indexOf(term) !== -1) : items;
  }
}

@Pipe({
  name: 'filterArray',
  pure: false
})
export class FilterArray implements PipeTransform {
  transform(items: any[], limit, reverse = false, reverseArray = false): any {
      let t;
      if (items.length <= limit) {
        t = items;
      } else {
        t = reverse ? items.slice(items.length - limit, items.length) : items.slice(0, limit);
      }
    return reverseArray ? t.slice().reverse() : t;
  }
}





