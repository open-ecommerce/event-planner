<?php

namespace backend\controllers\api;

/**
* This is the class for REST controller "BookDealsController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class BookDealsController extends \yii\rest\ActiveController
{
public $modelClass = 'common\models\BookDeals';
}
