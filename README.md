# js-utils
A bunch of simple JavaScript projects.


-----
## Hourglass
Countdown from a given time to zero.  Hourglass is a software made to help presentations, when it can be used to show the remaining time to the speaker.

### Usage
If you just load Hourglass, it'll start a 60-minute count.  If you wanna change it, just pass as a parameter in the URI, starting with `?t=`.  Then, you can choose 2 methods of setting time:

1. using seconds; and
2. using hour, minute, second notation.

If you decide to use just the seconds, just type the number, like `?t=1800`, which will count from 30 minutes.

If you want to use a more human way, you can define hours using letter `h`, minutes using letter `m`, and seconds using letter `s` --Hourglass is case insensitive for this.  Example: `?t=1h30m12s`.  Remember that combinations are allowed, like `?t=1h` or `?t=1h30s` or `?t=20m16s`.

When the remaining time is less than 30% of total time, the background will become yellow, and it'll turn to red when the remaining time is less than 10% of total time.


-----
## Locksmith
Locksmith  is an open source password generator.  It provides a web interface to generate secure [pseudo-]random passwords according to user's preferences.


-----
## Octet
Another IP calculator.  Octet is an open-source IP calculator written in JavaScript.  The main goal of this project is to be an IP calculator accessible by browser and mobile devices --responsive design.

### Application Programming Interface (API)
Using the functions in `js/ipv4-calc.js` file, you're able to do things like list masks...

```javascript
for (var i = 0; i <= 32; i++){
    console.log(i + '\t-\t'+ ipv4_int2str(fill_mask(i)));
}
```

...or show a range of IP addresses.

```javascript
for (var i = 0; i < 1024; i++){
    console.log(i + '\t-\t' + dec2bin(i));
}
```


-----
## Abacus
An open-source Common Vulnerability Scoring System (CVSS) calculator.  An open-source alternative for [Common Vulnerability Scoring System Version 2 Calculator](http://nvd.nist.gov/cvss.cfm?calculator&version=2).  For a better understanding on how CVSS works, you should read the [Complete Guide to the Common Vulnerability Scoring System Version 2.0](http://www.first.org/cvss/cvss-guide).

### _Modus Operandi_
Unlike [NIST's calculator](http://nvd.nist.gov/cvss.cfm?calculator&version=2), Abacus does not use "not defined" options.  Instead, every metric is initialized with its first values --e.g., Local for Access Vector and Unproven for Exploitability.

If user expands Temporal and/or Environmental metrics, score and vector will be recalculated, considering those metrics are set with their first values.

Be known that you will always have to use Base metrics.  Temporal metrics can be turned on at your will, but Environmental metrics depend on Temporal.  This way, if you turn on Environmental metrics and Temporal are off, it will be turned on too.  The same way, if you turn down Temporal metrics and Environmental metrics are on, it'll be turned off.  Consider using the "Not Defined" values to ignore certain metrics, as described in [CVSS v2 Guide](http://www.first.org/cvss/cvss-guide.html).


-----
## Bradocs
An implementation of functions to validate/generate some Brazilians documents.  The key file of this project is `js/bradocs.js`.  In its first part, all main functions are implemented and in the last part, some functions used in the example --`bradocs.html`-- are set.


-----
## License
All files are released under MIT license.  Third party softwares have their own licenses.
