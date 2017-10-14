<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205404_rightsowner extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%rightsowner}}',
            [
                'id'=> $this->primaryKey(11),
                'name'=> $this->string(200)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%rightsowner}}');
    }
}
