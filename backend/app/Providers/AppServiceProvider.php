<?php

namespace App\Providers;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
    public function boot() {
        URL::forceRootUrl(config('app.url'));
    }
    public function register(): void {
        //
    }

}
