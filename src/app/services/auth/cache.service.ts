import {Injectable} from "@angular/core";

/**
 * LVT Manage an app cache, to storage app managed objects.
 */
@Injectable()
export class CacheService {

    constructor() {}

    store(name: string, object: any) {
        if (!this.isJsonObject(object)) {
            localStorage.setItem(name, JSON.stringify(object));
        }else{
            localStorage.setItem(name, object);
        }
    }

    retrieve(name: string): any {
        return JSON.parse(localStorage.getItem(name));
    }

    remove(name: string) {
        if (this.exists(name)) {
            localStorage.removeItem(name);
        }
    }

    exists(name: string): boolean {
        return (this.retrieve(name));
    }

    private isJsonObject(object: any) {
        try {
            JSON.parse(object);
        } catch (e) {
            return false;
        }
        return true;
    }

}
