import { Result } from 'meow';
import { inspect } from 'util';

export default function(cli: Result) {
  console.log(inspect(cli, true, null, true));
}
