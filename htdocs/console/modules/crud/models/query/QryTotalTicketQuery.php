<?php

namespace app\modules\crud\models\query;

/**
 * This is the ActiveQuery class for [[\app\modules\crud\models\QryTotalTicket]].
 *
 * @see \app\modules\crud\models\QryTotalTicket
 */
class QryTotalTicketQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return \app\modules\crud\models\QryTotalTicket[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return \app\modules\crud\models\QryTotalTicket|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
