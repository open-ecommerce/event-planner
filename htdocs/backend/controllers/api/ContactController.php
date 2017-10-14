<?php

namespace backend\controllers\api;

/**
* This is the class for REST controller "ContactController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class ContactController extends \yii\rest\ActiveController
{
public $modelClass = 'common\models\Contact';
}
