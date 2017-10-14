<?php

namespace common\models;

use Yii;
use common\models\base\ContactType as BaseContactType;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "contact_type".
 */
class ContactType extends BaseContactType
{

public function behaviors()
    {
        return ArrayHelper::merge(
            parent::behaviors(),
            [
                # custom behaviors
            ]
        );
    }

    public function rules()
    {
        return ArrayHelper::merge(
             parent::rules(),
             [
                  # custom validation rules
             ]
        );
    }
}
