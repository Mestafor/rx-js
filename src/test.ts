import Rx from 'rx';

var observable = Rx.Observable.create(function (observer: any) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    observer.next(4); // Is not delivered because it would violate the contract
});

observable.subscribe(x => console.log(x));