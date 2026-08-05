# BDApi4All PHP & WordPress Integration

This package provides a lightweight PHP client, Laravel Service Provider snippet, and WordPress plugin snippet for accessing BDApi4All endpoints.

## PHP Client (`BdApiClient.php`)

```php
<?php

namespace BdApi4All;

class BdApiClient {
    private string $baseUrl;
    private ?string $apiKey;

    public function __construct(?string $apiKey = null, string $baseUrl = "https://bdapi4all.vercel.app/api/v1") {
        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    public function get(string $endpoint, array $queryParams = []): array {
        $url = $this->baseUrl . '/' . ltrim($endpoint, '/');
        if (!empty($queryParams)) {
            $url .= '?' . http_build_query($queryParams);
        }

        $opts = [
            "http" => [
                "method" => "GET",
                "header" => array_filter([
                    "Accept: application/json",
                    $this->apiKey ? "X-API-Key: " . $this->apiKey : null,
                ])
            ]
        ];

        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        
        if ($result === false) {
            throw new \RuntimeException("Failed to fetch data from BDApi4All API.");
        }

        return json_decode($result, true);
    }
}
```

## WordPress Plugin Snippet (`bdapi4all-wp.php`)

```php
<?php
/**
 * Plugin Name: BDApi4All Shortcodes
 * Description: Embed Bangladesh administrative & encyclopedia data via BDApi4All REST API.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

add_shortcode('bdapi_districts', function($atts) {
    $atts = shortcode_atts(['division_id' => ''], $atts);
    $url = 'https://bdapi4all.vercel.app/api/v1/districts';
    if (!empty($atts['division_id'])) {
        $url .= '?division_id=' . esc_attr($atts['division_id']);
    }
    
    $response = wp_remote_get($url);
    if (is_wp_error($response)) {
        return '<p>Error loading Bangladesh data.</p>';
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (empty($body['success']) || empty($body['data'])) {
        return '<p>No data returned.</p>';
    }

    $output = '<ul class="bdapi-districts">';
    foreach ($body['data'] as $item) {
        $output .= '<li>' . esc_html($item['name_en']) . ' (' . esc_html($item['name_bn']) . ')</li>';
    }
    $output .= '</ul>';
    return $output;
});
```
