<?php

use yii\helpers\BaseStringHelper;

$mobileBook = '<div class="short">' . BaseStringHelper::truncateWords($model->carouselDescription, 30, null, true) . '<a href="/book/' . $model->slug . '">read more</a></div>';
echo $mobileBook;
