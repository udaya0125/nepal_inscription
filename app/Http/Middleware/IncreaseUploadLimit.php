<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IncreaseUploadLimit
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Increase PHP limits for large file uploads (300MB)
        ini_set('upload_max_filesize', '300M');
        ini_set('post_max_size', '300M');
        ini_set('max_execution_time', '600');
        ini_set('max_input_time', '600');
        ini_set('memory_limit', '512M');
        
        // Set max input variables for Windows
        ini_set('max_input_vars', 3000);
        
        // For NGINX support
        if (!headers_sent()) {
            header('X-Accel-Buffering: yes');
            header('X-Accel-Limit-Rate: 0');
        }

        return $next($request);
    }
}