# HPC Pack Web Portal

[![Build Status](https://dev.azure.com/leizhan/hpcpack-web-portal-azure/_apis/build/status/Azure.hpcpack-web-portal?branchName=master)](https://dev.azure.com/leizhan/hpcpack-web-portal-azure/_build/latest?definitionId=7&branchName=master)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.1.
## Get code

```bash
$ git clone --recurse-submodules git@github.com:Azure/hpcpack-web-portal.git
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

* For production build, run `npm run-script build-prd`
* For staging build, run `npm run-script build-stg`

The build artifacts will be stored in the `dist/web-portal` directory.

## Package

To package the build artifacts and release the package, run `./make-zip {version}`. The `version` is typically like '1.2.3'. However, it can be arbitrary string, like 'dev'. Usually, Azure Pipeline will produce a package with the command and assign a proper value to the version.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
